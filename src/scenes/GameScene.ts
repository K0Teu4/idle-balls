import Phaser from "phaser";

import { Peg, PEG_BODY_LABEL } from "../game/Peg";
import { Slot } from "../game/Slot";
import { BallType } from "../game/BallType";
import { BALL_BODY_LABEL } from "../game/Ball";
import { FloatingText } from "../game/FloatingText";

import {
    GAME_AREA,
    SLOT_HEIGHT,
    SLOT_VALUES
} from "../config/GameConfig";

import { EconomyConfig } from "../config/EconomyConfig";

import { StatisticsManager } from "../managers/StatisticsManager";
import { AchievementWindow } from "../ui/AchievementWindow";
import { AchievementManager } from "../managers/AchievementManager";
import { EconomyManager } from "../managers/EconomyManager";
import { BallManager } from "../managers/BallManager";
import { AutoDropperManager } from "../managers/AutoDropperManager";
import { MultiplierManager } from "../managers/MultiplierManager";
import { BallCapacityManager } from "../managers/BallCapacityManager";
import { GoldenBallManager } from "../managers/GoldenBallManager";
import { LuckyPegManager } from "../managers/LuckyPegManager";
import { SpeedBoostManager } from "../managers/SpeedBoostManager";
import { ComboManager } from "../managers/ComboManager";
import { DailyBonusManager } from "../managers/DailyBonusManager";
import { IncomeTracker } from "../managers/IncomeTracker";
import { SaveManager } from "../managers/SaveManager";
import { ApShopManager } from "../managers/ApShopManager";
import { formatNumber } from "../utils/NumberFormatter";
import { formatOfflineTime } from "../utils/TimeFormat";
import { buildStatisticsRows } from "../utils/StatisticsFormatter";
import { simulateBackgroundTime } from "../services/BackgroundSimulator";
import {
    GAME_WIDTH,
    GAME_HEIGHT,
    SHOP_X,
    SHOP_WIDTH
} from "../config/GameConfig";
import type { ApShopUpgradeId } from "../config/ApShopConfig";

import { HudPanel } from "../ui/HudPanel";
import { ShopPanel } from "../ui/ShopPanel";
import { StatisticsWindow } from "../ui/StatisticsWindow";
import { ApShopWindow } from "../ui/ApShopWindow";
import { ToastManager } from "../ui/ToastManager";
import { AchievementPointManager } from "../managers/AchievementPointManager";

import { SlotRewardService } from "../services/SlotRewardService";
import { calculateOfflineProgress } from "../services/OfflineProgressService";
import { GameEventBus } from "../core/GameEventBus";

export class GameScene extends Phaser.Scene {

    private slots: Slot[] = [];

    private readonly economy = new EconomyManager();

    private ballManager!: BallManager;

    private readonly autoDropper = new AutoDropperManager();

    private readonly multiplier = new MultiplierManager();

    private readonly ballCapacity = new BallCapacityManager();

    private readonly goldenBall = new GoldenBallManager();

    private readonly luckyPeg = new LuckyPegManager();

    private readonly speedBoost = new SpeedBoostManager();

    private readonly combo = new ComboManager();

    private readonly dailyBonus = new DailyBonusManager();

    private readonly incomeTracker = new IncomeTracker();

    private readonly statistics = new StatisticsManager();

    private readonly achievements = new AchievementManager();

    private readonly achievementPoints = new AchievementPointManager();

    private readonly apShop = new ApShopManager();

    private readonly slotRewards = new SlotRewardService();

    private readonly gameEvents = new GameEventBus();

    private hudPanel!: HudPanel;

    private shopPanel!: ShopPanel;

    private statisticsWindow!: StatisticsWindow;

    private achievementWindow!: AchievementWindow;

    private apShopWindow!: ApShopWindow;

    private toasts!: ToastManager;

    private nextSpawnTime = 0;

    private nextAutoDrop = 0;

    private tabHiddenAt = 0;

    private readonly onBeforeUnload = (): void => {

        this.saveGame();
    };

    create(): void {

        this.drawChrome();
        this.drawGameArea();
        this.createBackgroundDecor();
        this.createBounds();
        this.createPegs();
        this.createSlots();

        const lastSaveTime = this.loadSave();

        this.combo.bindApShop(this.apShop);

        this.ballManager = new BallManager(this);
        this.ballManager.setMaxBalls(
            this.ballCapacity.getCapacity()
        );

        this.toasts = new ToastManager(this);

        this.statisticsWindow = new StatisticsWindow(this);

        this.achievementWindow = new AchievementWindow(
            this,
            this.scale.width,
            this.scale.height
        );

        this.apShopWindow = new ApShopWindow(
            this,
            this.scale.width,
            this.scale.height
        );

        this.apShopWindow.setBuyHandler(
            id => this.buyApUpgrade(id)
        );

        this.hudPanel = new HudPanel(
            this,
            () => this.trySpawnBall(),
            () => this.statisticsWindow.toggle(
                this.getStatisticsRows()
            ),
            () => this.achievementWindow.toggle(),
            () => {
                this.apShopWindow.updateDisplay(
                    this.apShop,
                    this.achievementPoints.getPoints()
                );
                this.apShopWindow.toggle();
            },
            () => this.claimDailyBonus()
        );

        this.shopPanel = new ShopPanel(
            this,
            () => this.buyAutoDropper(),
            () => this.buyMultiplier(),
            () => this.buyBallCapacity(),
            () => this.buyGoldenBall(),
            () => this.buyLuckyPeg(),
            () => this.buySpeedBoost()
        );

        this.setupCollisions();
        this.setupKeyboard();
        this.setupEventToasts();
        this.setupVisibilityHandler();

        this.refreshSlotLabels();

        this.achievements.syncTiersFromProgress(
            this.getAchievementState()
        );

        this.achievementWindow.syncAchievements(
            this.achievements.getAchievements()
        );

        if (lastSaveTime !== null) {
            this.applyOfflineProgress(lastSaveTime);
        }

        if (this.dailyBonus.canClaim()) {
            this.toasts.show(
                "Daily bonus available!",
                "#ffd700"
            );
        }

        this.startAutosave();
    }

    update(): void {

        this.statistics.tickPlayTime();
        this.toasts.update();

        this.ballManager.update();

        this.slotRewards.processBalls(
            this,
            this.ballManager.getBalls(),
            this.slots,
            {
                multiplier: this.multiplier.getMultiplier(),
                goldenRewardMultiplier:
                    this.getGoldenRewardMultiplier(),
                incomeBoostMultiplier:
                    this.apShop.getIncomeMultiplier()
            },
            {
                registerComboHit: () =>
                    this.combo.registerHit(),

                onReward: (reward, isGolden, combo) => {

                    this.economy.addMoney(reward);
                    this.statistics.addMoneyEarned(reward);
                    this.statistics.addSlotHit();
                    this.incomeTracker.record(reward);

                    this.gameEvents.emit("slot:hit", {
                        reward,
                        isGolden,
                        combo
                    });
                }
            }
        );

        this.updateHud();

        this.statisticsWindow.updateRows(
            this.getStatisticsRows()
        );

        this.achievements.update(
            this.getAchievementState(),
            achievement => {

                this.achievementPoints.add(
                    achievement.reward
                );

                this.gameEvents.emit(
                    "achievement:unlock",
                    {
                        reward: achievement.reward,
                        title: achievement.title
                    }
                );
            }
        );

        this.achievementWindow.syncAchievements(
            this.achievements.getAchievements()
        );

        if (this.apShopWindow.visible) {
            this.apShopWindow.updateDisplay(
                this.apShop,
                this.achievementPoints.getPoints()
            );
        }

        this.processAutoDropper();
    }

    shutdown(): void {

        document.removeEventListener(
            "visibilitychange",
            this.onVisibilityChange
        );

        window.removeEventListener(
            "beforeunload",
            this.onBeforeUnload
        );
    }

    private readonly onVisibilityChange = (): void => {

        if (document.hidden) {
            this.tabHiddenAt = Date.now();
            return;
        }

        if (this.tabHiddenAt <= 0) {
            return;
        }

        const elapsed =
            Date.now() - this.tabHiddenAt;

        this.tabHiddenAt = 0;
        this.applyBackgroundProgress(elapsed);
    };

    private setupVisibilityHandler(): void {

        document.addEventListener(
            "visibilitychange",
            this.onVisibilityChange
        );
    }

    private applyBackgroundProgress(
        elapsedMs: number
    ): void {

        const result = simulateBackgroundTime({
            elapsedMs,
            ballsPerSecond:
                this.autoDropper.getBallsPerSecond(),
            autoDropMultiplier:
                this.speedBoost.getAutoDropMultiplier(),
            multiplier: this.multiplier.getMultiplier(),
            goldenChance: this.goldenBall.getChance(),
            goldenRewardMultiplier:
                this.getGoldenRewardMultiplier(),
            incomeBoostMultiplier:
                this.apShop.getIncomeMultiplier(),
            ballCost: this.getBallCost()
        });

        if (!result) {
            return;
        }

        this.economy.addMoney(result.income);
        this.statistics.addMoneyEarned(result.income);
        this.statistics.addPlayTime(
            result.secondsSimulated
        );
        this.incomeTracker.record(result.income);

        this.toasts.show(
            `While away +${formatNumber(result.income)}`,
            "#a8d4ff",
            3500
        );
    }

    private drawChrome(): void {

        this.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            0x0c0c0c
        );

        this.add.rectangle(
            SHOP_X + SHOP_WIDTH / 2 - 8,
            GAME_HEIGHT / 2,
            SHOP_WIDTH + 32,
            GAME_HEIGHT,
            0x121212
        );
    }

    private setupEventToasts(): void {

        this.gameEvents.on("achievement:unlock", payload => {

            this.toasts.show(
                `🏆 ${payload.title} (+${payload.reward} AP)`,
                "#d4af37",
                2800
            );
        });

        this.gameEvents.on("daily:claim", payload => {

            this.toasts.show(
                `Daily +${formatNumber(payload.reward)} (streak ${payload.streak})`,
                "#ffd700",
                3000
            );
        });
    }

    private setupKeyboard(): void {

        this.input.keyboard?.on(
            "keydown-SPACE",
            () => this.trySpawnBall()
        );

        this.input.keyboard?.on(
            "keydown-ESC",
            () => {
                this.statisticsWindow.hide();
                this.achievementWindow.hide();
                this.apShopWindow.hide();
            }
        );
    }

    private setupCollisions(): void {

        this.matter.world.on(
            "collisionstart",
            (
                event: Phaser.Physics.Matter.Events.CollisionStartEvent
            ) => {

                for (const pair of event.pairs) {

                    this.tryPegCollision(
                        pair.bodyA,
                        pair.bodyB
                    );
                }
            }
        );
    }

    private tryPegCollision(
        bodyA: MatterJS.BodyType,
        bodyB: MatterJS.BodyType
    ): void {

        const labels = [
            bodyA.label,
            bodyB.label
        ];

        if (
            !labels.includes(BALL_BODY_LABEL) ||
            !labels.includes(PEG_BODY_LABEL)
        ) {
            return;
        }

        const ballBody =
            bodyA.label === BALL_BODY_LABEL
                ? bodyA
                : bodyB;

        const ball =
            this.ballManager.findByBody(ballBody);

        if (!ball || !ball.canHitPeg()) {
            return;
        }

        ball.markPegHit();

        const bonus =
            this.luckyPeg.rollBonus(
                this.multiplier.getMultiplier()
            );

        if (bonus <= 0) {
            return;
        }

        this.economy.addMoney(bonus);
        this.statistics.addPegBonus(bonus);
        this.incomeTracker.record(bonus);

        FloatingText.create(
            this,
            ball.getX(),
            ball.getY() - 20,
            `+${formatNumber(bonus)}`,
            "#7dffb2",
            20
        );

        this.gameEvents.emit("peg:bonus", { bonus });
    }

    private getAchievementState() {

        return {
            statistics: this.statistics,
            autoDropperLevel: this.autoDropper.getLevel(),
            totalShopPurchases:
                this.statistics.getTotalShopPurchases(),
            bestCombo: this.combo.getBestCombo()
        };
    }

    private getBallCost(): number {

        return Math.max(
            0.5,
            EconomyConfig.BALL_COST *
            this.apShop.getBallCostMultiplier()
        );
    }

    private getGoldenRewardMultiplier(): number {

        return (
            this.goldenBall.getRewardMultiplier() +
            this.apShop.getGoldenRewardBonus()
        );
    }

    private recordShopPurchase(): void {

        this.statistics.addShopPurchase();
        this.gameEvents.emit("shop:purchase", {
            item: "upgrade"
        });
    }

    private getStatisticsRows() {

        const autoMult =
            this.speedBoost.getAutoDropMultiplier();

        return buildStatisticsRows({
            statistics: this.statistics,
            combo: this.combo,
            incomeTracker: this.incomeTracker,
            dailyBonus: this.dailyBonus,
            currentMoney: this.economy.getMoney(),
            autoRate: Math.round(
                this.autoDropper.getBallsPerSecond() *
                autoMult *
                10
            ) / 10,
            autoDropBonusPercent: Math.round(
                (autoMult - 1) * 100
            ),
            multiplier: this.multiplier.getMultiplier(),
            incomeBoostPercent: Math.round(
                (this.apShop.getIncomeMultiplier() - 1) * 100
            )
        });
    }

    private updateHud(): void {

        const combo = this.combo.getCombo();
        const comboProgress =
            combo > 0
                ? this.combo.getTimeLeftMs() /
                  EconomyConfig.COMBO_WINDOW_MS
                : 0;

        this.hudPanel.update({
            money: this.economy.getMoney(),
            currentBalls: this.ballManager.getBallCount(),
            ap: this.achievementPoints.getPoints(),
            maxBalls: this.ballManager.getMaxBalls(),
            ballCost: this.getBallCost(),
            combo: this.combo.getDisplayCombo(),
            comboBonusPercent: this.combo.getBonusPercent(),
            comboProgress,
            incomePerSec: this.incomeTracker.getPerSecond(),
            dailyReady: this.dailyBonus.canClaim(),
            dailyStreak: this.dailyBonus.getStreak()
        });

        const autoMult =
            this.speedBoost.getAutoDropMultiplier();

        this.shopPanel.update({
            money: this.economy.getMoney(),
            autoDropperLevel: this.autoDropper.getLevel(),
            autoDropperCost: this.autoDropper.getCost(),
            autoDropperRate:
                Math.round(
                    this.autoDropper.getBallsPerSecond() *
                    autoMult *
                    10
                ) / 10,
            multiplierLevel: this.multiplier.getLevel(),
            multiplierValue: this.multiplier.getMultiplier(),
            multiplierCost: this.multiplier.getCost(),
            capacityLevel: this.ballCapacity.getLevel(),
            capacityValue: this.ballCapacity.getCapacity(),
            capacityCost: this.ballCapacity.getCost(),
            goldenBallLevel: this.goldenBall.getLevel(),
            goldenBallChance: this.goldenBall.getChance(),
            goldenBallCost: this.goldenBall.getCost(),
            luckyPegLevel: this.luckyPeg.getLevel(),
            luckyPegLines: this.luckyPeg.getInfoLines(),
            luckyPegCost: this.luckyPeg.getCost(),
            speedBoostLevel: this.speedBoost.getLevel(),
            speedBoostLines: this.speedBoost.getInfoLines(),
            speedBoostCost: this.speedBoost.getCost()
        });
    }

    private processAutoDropper(): void {

        const rate =
            this.autoDropper.getBallsPerSecond() *
            this.speedBoost.getAutoDropMultiplier();

        if (rate <= 0) {
            return;
        }

        if (this.time.now < this.nextAutoDrop) {
            return;
        }

        if (!this.ballManager.canSpawnBall()) {
            return;
        }

        if (!this.economy.spendMoney(this.getBallCost())) {
            return;
        }

        this.spawnBall();

        this.nextAutoDrop =
            this.time.now + 1000 / rate;
    }

    private buyAutoDropper(): void {

        if (!this.tryPurchase(this.autoDropper.getCost())) {
            return;
        }

        this.autoDropper.buy();
        this.recordShopPurchase();
    }

    private buyMultiplier(): void {

        if (!this.tryPurchase(this.multiplier.getCost())) {
            return;
        }

        this.multiplier.buy();
        this.refreshSlotLabels();
        this.recordShopPurchase();
    }

    private buyBallCapacity(): void {

        if (!this.tryPurchase(this.ballCapacity.getCost())) {
            return;
        }

        this.ballCapacity.buy();
        this.ballManager.setMaxBalls(
            this.ballCapacity.getCapacity()
        );
        this.recordShopPurchase();
    }

    private buyGoldenBall(): void {

        if (!this.tryPurchase(this.goldenBall.getCost())) {
            return;
        }

        this.goldenBall.buy();
        this.recordShopPurchase();
    }

    private buyLuckyPeg(): void {

        if (!this.tryPurchase(this.luckyPeg.getCost())) {
            return;
        }

        this.luckyPeg.buy();
        this.recordShopPurchase();
    }

    private buySpeedBoost(): void {

        if (!this.tryPurchase(this.speedBoost.getCost())) {
            return;
        }

        this.speedBoost.buy();
        this.recordShopPurchase();
    }

    private buyApUpgrade(
        id: ApShopUpgradeId
    ): void {

        const cost = this.apShop.getCost(id);

        if (this.achievementPoints.getPoints() < cost) {
            this.hudPanel.showMessage("Not enough AP!");
            return;
        }

        if (!this.achievementPoints.spend(cost)) {
            return;
        }

        this.apShop.buy(id);
        this.refreshSlotLabels();

        this.apShopWindow.updateDisplay(
            this.apShop,
            this.achievementPoints.getPoints()
        );

        this.hudPanel.showMessage("AP upgrade bought!");
    }

    private claimDailyBonus(): void {

        if (!this.dailyBonus.canClaim()) {
            this.hudPanel.showMessage(
                "Daily bonus already claimed!"
            );
            return;
        }

        const reward =
            this.dailyBonus.claim(
                this.statistics.getTotalMoneyEarned()
            );

        this.economy.addMoney(reward);
        this.statistics.addMoneyEarned(reward);
        this.incomeTracker.record(reward);

        this.gameEvents.emit("daily:claim", {
            reward,
            streak: this.dailyBonus.getStreak()
        });
    }

    private tryPurchase(cost: number): boolean {

        if (!this.economy.spendMoney(cost)) {
            this.hudPanel.showMessage("Not enough money!");
            return false;
        }

        return true;
    }

    private trySpawnBall(): void {

        if (this.time.now < this.nextSpawnTime) {
            return;
        }

        if (!this.ballManager.canSpawnBall()) {
            this.hudPanel.showMessage("Ball limit reached!");
            return;
        }

        if (!this.economy.spendMoney(this.getBallCost())) {
            this.hudPanel.showMessage("Not enough money!");
            return;
        }

        this.spawnBall();

        this.nextSpawnTime =
            this.time.now +
            this.speedBoost.getSpawnCooldownMs();
    }

    private spawnBall(): void {

        const centerX =
            GAME_AREA.x + GAME_AREA.width / 2;

        const spawnX =
            centerX + Phaser.Math.Between(-20, 20);

        const roll = Phaser.Math.Between(1, 100);

        const type =
            roll <= this.goldenBall.getChance()
                ? BallType.Golden
                : BallType.Normal;

        const ball = this.ballManager.spawnBall(
            spawnX,
            GAME_AREA.y + 50,
            type
        );

        if (!ball) {
            return;
        }

        this.statistics.addBallDropped();

        if (type === BallType.Golden) {
            this.statistics.addGoldenBallDropped();
        }
    }

    private drawGameArea(): void {

        this.add.rectangle(
            GAME_AREA.x + GAME_AREA.width / 2,
            GAME_AREA.y + GAME_AREA.height / 2,
            GAME_AREA.width,
            GAME_AREA.height,
            0x111111
        ).setStrokeStyle(2, 0x555555);
    }

    private createBackgroundDecor(): void {

        for (let i = 0; i < 40; i++) {

            this.add.circle(
                Phaser.Math.Between(
                    GAME_AREA.x,
                    GAME_AREA.x + GAME_AREA.width
                ),
                Phaser.Math.Between(
                    GAME_AREA.y,
                    GAME_AREA.y + GAME_AREA.height
                ),
                Phaser.Math.Between(1, 2),
                0xffffff,
                0.08
            );
        }
    }

    private createBounds(): void {

        const left = GAME_AREA.x;
        const right = GAME_AREA.x + GAME_AREA.width;
        const top = GAME_AREA.y;

        this.matter.add.rectangle(
            left,
            top + GAME_AREA.height / 2,
            20,
            GAME_AREA.height,
            { isStatic: true }
        );

        this.matter.add.rectangle(
            right,
            top + GAME_AREA.height / 2,
            20,
            GAME_AREA.height,
            { isStatic: true }
        );

        for (let i = 1; i < SLOT_VALUES.length; i++) {

            const slotWidth =
                GAME_AREA.width / SLOT_VALUES.length;

            const dividerX = left + slotWidth * i;

            this.matter.add.rectangle(
                dividerX,
                GAME_AREA.y +
                GAME_AREA.height -
                SLOT_HEIGHT / 2,
                8,
                SLOT_HEIGHT,
                { isStatic: true }
            );

            this.add.rectangle(
                dividerX,
                GAME_AREA.y +
                GAME_AREA.height -
                SLOT_HEIGHT / 2,
                4,
                SLOT_HEIGHT,
                0xffffff,
                1
            ).setDepth(100);

            this.add.rectangle(
                dividerX,
                GAME_AREA.y +
                GAME_AREA.height -
                SLOT_HEIGHT / 2,
                10,
                SLOT_HEIGHT,
                0xffffff,
                0.15
            ).setDepth(99);
        }
    }

    private createPegs(): void {

        const rows = 8;
        const spacingX = 80;
        const spacingY = 60;
        const startY = 140;
        const centerX =
            GAME_AREA.x + GAME_AREA.width / 2;

        for (let row = 0; row < rows; row++) {

            const count = row + 1;

            for (let col = 0; col < count; col++) {

                new Peg(
                    this,
                    centerX -
                    ((count - 1) * spacingX) / 2 +
                    col * spacingX,
                    startY + row * spacingY
                );
            }
        }
    }

    private createSlots(): void {

        const slotWidth =
            GAME_AREA.width / SLOT_VALUES.length;

        const slotY =
            GAME_AREA.y +
            GAME_AREA.height -
            SLOT_HEIGHT;

        for (let i = 0; i < SLOT_VALUES.length; i++) {

            const baseValue = SLOT_VALUES[i]!;

            const slot = new Slot(
                this,
                GAME_AREA.x + slotWidth * i,
                slotY,
                slotWidth,
                SLOT_HEIGHT,
                baseValue
            );

            if (baseValue >= 10) {
                slot.highlightJackpot();
            }

            this.slots.push(slot);
        }
    }

    private refreshSlotLabels(): void {

        const multiplier =
            this.multiplier.getMultiplier();

        for (const slot of this.slots) {
            slot.updateLabel(multiplier);
        }
    }

    private applyOfflineProgress(
        lastSaveTime: number
    ): void {

        const result = calculateOfflineProgress({
            lastSaveTime,
            ballsPerSecond:
                this.autoDropper.getBallsPerSecond(),
            autoDropMultiplier:
                this.speedBoost.getAutoDropMultiplier(),
            multiplier: this.multiplier.getMultiplier(),
            goldenChance: this.goldenBall.getChance(),
            goldenRewardMultiplier:
                this.getGoldenRewardMultiplier(),
            incomeBoostMultiplier:
                this.apShop.getIncomeMultiplier(),
            ballCost: this.getBallCost()
        });

        if (!result) {
            return;
        }

        this.economy.addMoney(result.income);
        this.statistics.addMoneyEarned(result.income);

        this.showOfflinePopup(
            result.income,
            result.secondsAway
        );
    }

    private showOfflinePopup(
        income: number,
        secondsAway: number
    ): void {

        const text = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 60,
            [
                "WELCOME BACK",
                "",
                `Away: ${formatOfflineTime(secondsAway)}`,
                "",
                "Offline Earnings",
                `+${formatNumber(income)}`
            ].join("\n"),
            {
                fontSize: "28px",
                color: "#ffffff",
                align: "center",
                backgroundColor: "#222222",
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        )
        .setOrigin(0.5)
        .setDepth(999);

        this.tweens.add({
            targets: text,
            alpha: 0,
            delay: 4000,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    private saveGame(): void {

        SaveManager.save({
            version: 6,
            money: this.economy.getMoney(),
            autoDropperLevel: this.autoDropper.getLevel(),
            multiplierLevel: this.multiplier.getLevel(),
            ballCapacityLevel: this.ballCapacity.getLevel(),
            goldenBallLevel: this.goldenBall.getLevel(),
            luckyPegLevel: this.luckyPeg.getLevel(),
            speedBoostLevel: this.speedBoost.getLevel(),
            totalMoneyEarned:
                this.statistics.getTotalMoneyEarned(),
            totalBallsDropped:
                this.statistics.getTotalBallsDropped(),
            totalGoldenBallsDropped:
                this.statistics.getTotalGoldenBallsDropped(),
            achievementPoints:
                this.achievementPoints.getPoints(),
            achievements:
                this.achievements.getAchievements(),
            lastSaveTime: Date.now(),
            totalPlayTimeSeconds:
                this.statistics.getTotalPlayTimeSeconds(),
            highestSingleReward:
                this.statistics.getHighestSingleReward(),
            totalShopPurchases:
                this.statistics.getTotalShopPurchases(),
            apIncomeBoostLevel:
                this.apShop.getIncomeLevel(),
            apBallDiscountLevel:
                this.apShop.getDiscountLevel(),
            apGoldenBoostLevel:
                this.apShop.getGoldenLevel(),
            apComboBoostLevel:
                this.apShop.getComboLevel(),
            bestCombo: this.combo.getBestCombo(),
            totalSlotHits:
                this.statistics.getTotalSlotHits(),
            totalPegBonuses:
                this.statistics.getTotalPegBonuses(),
            totalPegBonusMoney:
                this.statistics.getTotalPegBonusMoney(),
            dailyLastClaimDay:
                this.dailyBonus.getLastClaimDay(),
            dailyStreak: this.dailyBonus.getStreak()
        });
    }

    private loadSave(): number | null {

        const save = SaveManager.load();

        if (!save) {
            return null;
        }

        this.economy.setMoney(save.money);
        this.autoDropper.setLevel(save.autoDropperLevel);
        this.multiplier.setLevel(save.multiplierLevel);
        this.ballCapacity.setLevel(save.ballCapacityLevel);
        this.goldenBall.setLevel(save.goldenBallLevel);
        this.luckyPeg.setLevel(save.luckyPegLevel);
        this.speedBoost.setLevel(save.speedBoostLevel);

        this.statistics.setData(
            save.totalMoneyEarned,
            save.totalBallsDropped,
            save.totalGoldenBallsDropped,
            save.totalPlayTimeSeconds,
            save.highestSingleReward,
            save.totalShopPurchases,
            save.totalSlotHits,
            save.totalPegBonuses,
            save.totalPegBonusMoney
        );

        this.combo.setBestCombo(save.bestCombo);

        this.achievementPoints.setPoints(
            save.achievementPoints
        );

        this.achievements.setAchievements(
            save.achievements
        );

        this.apShop.setLevels(
            save.apIncomeBoostLevel,
            save.apBallDiscountLevel,
            save.apGoldenBoostLevel,
            save.apComboBoostLevel ?? 0
        );

        this.dailyBonus.setState(
            save.dailyLastClaimDay,
            save.dailyStreak
        );

        return save.lastSaveTime;
    }

    private startAutosave(): void {

        this.time.addEvent({
            delay: EconomyConfig.AUTO_SAVE_INTERVAL_MS,
            loop: true,
            callback: () => this.saveGame()
        });

        window.addEventListener(
            "beforeunload",
            this.onBeforeUnload
        );
    }
}
