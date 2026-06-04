import Phaser from "phaser";

import { GAME_AREA, SLOT_VALUES, SLOT_HEIGHT, PEG_ROWS, PEG_SPACING_X, PEG_SPACING_Y, PEG_START_Y, PEG_RADIUS, BALL_RADIUS } from "../config/GameConfig";
import { EconomyConfig } from "../config/EconomyConfig";

import { Ball } from "../objects/Ball";
import { Peg } from "../objects/Peg";
import { Slot } from "../objects/Slot";
import { BallType } from "../objects/BallType";
import { FloatingText } from "../objects/FloatingText";
import { GoldenBurst } from "../objects/GoldenBurst";
import { LuckyEffect } from "../objects/LuckyEffect";

import { EconomyManager } from "../managers/EconomyManager";
import { BallManager } from "../managers/BallManager";
import { AutoDropperManager } from "../managers/AutoDropperManager";
import { MultiplierManager } from "../managers/MultiplierManager";
import { BallCapacityManager } from "../managers/BallCapacityManager";
import { GoldenBallManager } from "../managers/GoldenBallManager";
import { LuckyPegManager } from "../managers/LuckyPegManager";
import { SpeedManager } from "../managers/SpeedManager";
import { ComboManager } from "../managers/ComboManager";
import { StatisticsManager } from "../managers/StatisticsManager";
import { AchievementManager } from "../managers/AchievementManager";
import { APManager } from "../managers/APManager";
import { APShopManager } from "../managers/APShopManager";
import { DailyBonusManager } from "../managers/DailyBonusManager";
import { SaveManager, SaveData } from "../managers/SaveManager";

import { HudPanel } from "../ui/HudPanel";
import { ShopPanel } from "../ui/ShopPanel";
import { StatisticsWindow } from "../ui/StatisticsWindow";
import { AchievementsWindow } from "../ui/AchievementsWindow";
import { APShopWindow } from "../ui/APShopWindow";
import { DailyBonusWindow } from "../ui/DailyBonusWindow";

import { fmt } from "../utils/NumberFormat";

export class GameScene extends Phaser.Scene {
    private economy = new EconomyManager();
    private ballManager!: BallManager;
    private autoDropper = new AutoDropperManager();
    private multiplier = new MultiplierManager();
    private ballCapacity = new BallCapacityManager();
    private goldenBall = new GoldenBallManager();
    private luckyPeg = new LuckyPegManager();
    private speed = new SpeedManager();
    private combo = new ComboManager();
    private statistics = new StatisticsManager();
    private achievements = new AchievementManager();
    private ap = new APManager();
    private apShop = new APShopManager();
    private dailyBonus = new DailyBonusManager();

    private slots: Slot[] = [];
    private pegFlashMap: Map<string, Phaser.GameObjects.Arc> = new Map();
    private processedBalls: Set<Ball> = new Set();

    private hud!: HudPanel;
    private shop!: ShopPanel;
    private statsWindow!: StatisticsWindow;
    private achievementsWindow!: AchievementsWindow;
    private apShopWindow!: APShopWindow;
    private dailyBonusWindow!: DailyBonusWindow;

    private nextAutoDrop = 0;
    private nextManualDrop = 0;
    private lastSaveTime = 0;
    private totalPegBonusCount = 0;
    private sessionMoneyStart = 0;
    private spaceKey?: Phaser.Input.Keyboard.Key;
    private saveInterval = 5000;

    constructor() {
        super({ key: "GameScene" });
    }

    create(): void {
        this.drawBackground();
        this.createWalls();
        this.createPegs();
        this.createSlots();

        const save = this.loadSave();

        this.ballManager = new BallManager(this);
        this.ballManager.setMaxBalls(this.ballCapacity.getCapacity());

        this.refreshComboUpgrades();

        this.hud = new HudPanel(
            this,
            () => this.tryDropBall(this.time.now),
            () => this.showStats(),
            () => this.showAchievements(),
            () => this.showAPShop(),
            () => this.showDailyBonus()
        );

        this.shop = new ShopPanel(
            this,
            () => this.buy("autoDropper"),
            () => this.buy("multiplier"),
            () => this.buy("ballCapacity"),
            () => this.buy("goldenBall"),
            () => this.buy("luckyPeg"),
            () => this.buy("speed")
        );

        this.statsWindow = new StatisticsWindow(this);
        this.achievementsWindow = new AchievementsWindow(this);
        this.apShopWindow = new APShopWindow(this, this.apShop, (id) => this.buyAP(id));
        this.dailyBonusWindow = new DailyBonusWindow(this, () => this.claimDailyBonus());

        this.refreshSlotLabels();

        this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.matter.world.on("collisionstart", (event: any) => {
            for (const pair of event.pairs) {
                this.handleCollision(pair.bodyA, pair.bodyB);
            }
        });

        this.startAutosave();

        if (save !== null) {
            this.applyOfflineProgress(save.lastSaveTime);
        }

        this.sessionMoneyStart = this.economy.getMoney();

        if (this.dailyBonus.canClaim()) {
            this.time.delayedCall(800, () => this.showDailyBonus());
        }
    }

    update(time: number, delta: number): void {
        if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.tryDropBall(time);
        }

        this.ballManager.update();
        this.checkBallsBottom(time);
        this.processAutoDropper(time);
        this.combo.update(time);
        this.economy.updateRate(time);
        this.updateHUD(time);
        this.updateShop();
        this.updateAchievements(time);
    }

    private drawBackground(): void {
        const { x, y, width, height } = GAME_AREA;
        this.add.rectangle(0, 360, 262, 724, 0x0d1520).setOrigin(0, 0.5).setDepth(0);
        this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x0b1219)
            .setStrokeStyle(1, 0x1a2a3a).setDepth(0);
        this.add.rectangle(1280 - 170, 360, 340, 724, 0x0d1520).setOrigin(0.5).setDepth(0);

        for (let i = 0; i < 35; i++) {
            this.add.circle(
                Phaser.Math.Between(x + 5, x + width - 5),
                Phaser.Math.Between(y + 5, y + height - SLOT_HEIGHT - 5),
                Phaser.Math.Between(1, 2),
                0xffffff, 0.06
            ).setDepth(1);
        }
    }

    private createWalls(): void {
        const { x, y, width, height } = GAME_AREA;

        this.matter.add.rectangle(x - 8, y + height / 2, 16, height, { isStatic: true, label: "wall" });
        this.matter.add.rectangle(x + width + 8, y + height / 2, 16, height, { isStatic: true, label: "wall" });

        const slotW = width / SLOT_VALUES.length;
        for (let i = 1; i < SLOT_VALUES.length; i++) {
            const dx = x + slotW * i;
            const dy = y + height - SLOT_HEIGHT / 2;
            this.matter.add.rectangle(dx, dy, 8, SLOT_HEIGHT, { isStatic: true, label: "divider" });
            this.add.rectangle(dx, dy, 3, SLOT_HEIGHT, 0x445566, 0.8).setDepth(6);
        }

        this.add.rectangle(x - 1, y + height / 2, 2, height, 0x445566, 0.8).setDepth(6);
        this.add.rectangle(x + width + 1, y + height / 2, 2, height, 0x445566, 0.8).setDepth(6);
    }

    private createPegs(): void {
        const cx = GAME_AREA.x + GAME_AREA.width / 2;
        const startY = GAME_AREA.y + PEG_START_Y;

        for (let row = 0; row < PEG_ROWS; row++) {
            const count = row + 1;
            for (let col = 0; col < count; col++) {
                const px = cx - ((count - 1) * PEG_SPACING_X) / 2 + col * PEG_SPACING_X;
                const py = startY + row * PEG_SPACING_Y;
                new Peg(this, px, py);
            }
        }
    }

    private createSlots(): void {
        const { x, y, width, height } = GAME_AREA;
        const slotW = width / SLOT_VALUES.length;
        const slotY = y + height - SLOT_HEIGHT;
        const centerIdx = Math.floor(SLOT_VALUES.length / 2);

        for (let i = 0; i < SLOT_VALUES.length; i++) {
            const slot = new Slot(
                this,
                x + slotW * i, slotY,
                slotW, SLOT_HEIGHT,
                SLOT_VALUES[i],
                i === centerIdx
            );
            this.slots.push(slot);
        }
    }

    private refreshSlotLabels(): void {
        const mult = this.multiplier.getMultiplier();
        const apBoost = this.apShop.getIncomeBoostMult();
        for (const slot of this.slots) slot.updateLabel(mult, apBoost);
    }

    private refreshComboUpgrades(): void {
        this.combo.setAPUpgrades(
            this.apShop.getComboWindowBonus(),
            this.apShop.getComboStackBonus()
        );
    }

    private handleCollision(bodyA: any, bodyB: any): void {
        let ballBody: any = null;
        let otherBody: any = null;

        if (bodyA.label === "ball" && bodyB.label === "peg") {
            ballBody = bodyA; otherBody = bodyB;
        } else if (bodyB.label === "ball" && bodyA.label === "peg") {
            ballBody = bodyB; otherBody = bodyA;
        }

        if (!ballBody) return;

        const ball = this.ballManager.getBalls().find(b => b.body === ballBody);
        if (!ball || this.processedBalls.has(ball)) return;

        const pegX = otherBody.position.x;
        const pegY = otherBody.position.y;

        const chancePct = this.luckyPeg.getChancePct();
        if (chancePct > 0 && Phaser.Math.Between(1, 100) <= chancePct) {
            const baseIncome = (this.slots.reduce((s, sl) => s + sl.value, 0) / this.slots.length)
                * this.multiplier.getMultiplier()
                * this.apShop.getIncomeBoostMult()
                * this.luckyPeg.getPower();
            const income = Math.floor(baseIncome);
            if (income > 0) {
                this.economy.addMoney(income);
                this.statistics.addMoney(income);
                this.statistics.addPegBonus(income);
                this.totalPegBonusCount++;
                LuckyEffect.create(this, pegX, pegY);
                FloatingText.create(this, pegX, pegY - 15, `+${fmt(income)}`, "#44ff99", 16);
            }
        }
    }

    private checkBallsBottom(time: number): void {
        const threshold = GAME_AREA.y + GAME_AREA.height - SLOT_HEIGHT - 2;

        for (const ball of this.ballManager.getBalls()) {
            if (this.processedBalls.has(ball)) continue;
            if (ball.getY() >= threshold) {
                const slot = this.slots.find(s => s.contains(ball.getX()));
                if (slot) {
                    this.onSlotHit(ball, slot, time);
                } else {
                    this.processedBalls.add(ball);
                    ball.destroy(this);
                }
            }
        }
    }

    private onSlotHit(ball: Ball, slot: Slot, time: number): void {
        this.processedBalls.add(ball);

        const { combo, multiplier: comboMult } = this.combo.onSlotHit(time);

        const baseVal = slot.value * this.multiplier.getMultiplier();
        const apBoost = this.apShop.getIncomeBoostMult();
        const goldenBonus = ball.isGolden()
            ? this.goldenBall.getRewardMultiplier() * this.apShop.getGoldenRewardBonus()
            : 1;

        const income = Math.floor(baseVal * apBoost * comboMult * goldenBonus);

        this.economy.addMoney(income);
        this.statistics.addMoney(income);
        this.statistics.addSlotHit();
        this.statistics.trackHit(income);
        this.statistics.trackCombo(combo);

        const bx = ball.getX();
        const by = GAME_AREA.y + GAME_AREA.height - SLOT_HEIGHT / 2;

        if (ball.isGolden()) {
            GoldenBurst.create(this, bx, by);
            FloatingText.create(this, bx, by - 20, `+${fmt(income)}`, "#ffd700", 26);
        } else {
            FloatingText.create(this, bx, by - 15, `+${fmt(income)}`, "#88ddff", 20);
        }

        slot.flash(this);

        ball.destroy(this);

        this.time.delayedCall(10, () => {
            this.processedBalls.delete(ball);
        });
    }

    private tryDropBall(time: number): void {
        const interval = this.speed.getDropIntervalMs();
        if (time < this.nextManualDrop) return;

        if (!this.ballManager.canSpawnBall()) {
            this.hud.showMessage("Ball limit reached!");
            return;
        }

        const cost = this.getBallCost();
        if (!this.economy.spendMoney(cost)) {
            this.hud.showMessage("Not enough money!");
            return;
        }

        this.spawnBall();
        this.nextManualDrop = time + interval;
    }

    private processAutoDropper(time: number): void {
        const rate = this.autoDropper.getBallsPerSecond();
        if (rate <= 0) return;

        const autoBoost = 1 + this.speed.getAutoBoostPct() / 100;
        const effectiveRate = rate * autoBoost;
        const intervalMs = 1000 / effectiveRate;

        if (time < this.nextAutoDrop) return;
        if (!this.ballManager.canSpawnBall()) return;

        const cost = this.getBallCost();
        if (!this.economy.spendMoney(cost)) return;

        this.spawnBall();
        this.nextAutoDrop = time + intervalMs;
    }

    private getBallCost(): number {
        return Math.max(0.01, EconomyConfig.BALL_BASE_COST * this.apShop.getBallCostMult());
    }

    private spawnBall(): void {
        const cx = GAME_AREA.x + GAME_AREA.width / 2;
        const spawnX = cx + Phaser.Math.Between(-18, 18);
        const spawnY = GAME_AREA.y + 25;

        const roll = Phaser.Math.Between(1, 100);
        const type = roll <= this.goldenBall.getChancePct() ? BallType.Golden : BallType.Normal;

        const ball = this.ballManager.spawnBall(spawnX, spawnY, type);
        if (ball) {
            this.statistics.addBall();
            if (type === BallType.Golden) this.statistics.addGoldenBall();
        }
    }

    private buy(type: string): void {
        let cost = 0;
        switch (type) {
            case "autoDropper": cost = this.autoDropper.getCost(); break;
            case "multiplier": cost = this.multiplier.getCost(); break;
            case "ballCapacity": cost = this.ballCapacity.getCost(); break;
            case "goldenBall": cost = this.goldenBall.getCost(); break;
            case "luckyPeg": cost = this.luckyPeg.getCost(); break;
            case "speed": cost = this.speed.getCost(); break;
        }

        if (!this.economy.spendMoney(cost)) {
            this.hud.showMessage("Not enough money!");
            return;
        }

        switch (type) {
            case "autoDropper": this.autoDropper.buy(); break;
            case "multiplier": this.multiplier.buy(); this.refreshSlotLabels(); break;
            case "ballCapacity":
                this.ballCapacity.buy();
                this.ballManager.setMaxBalls(this.ballCapacity.getCapacity());
                break;
            case "goldenBall": this.goldenBall.buy(); break;
            case "luckyPeg": this.luckyPeg.buy(); break;
            case "speed": this.speed.buy(); break;
        }

        this.statistics.addPurchase();
    }

    private buyAP(id: string): void {
        const cost = this.apShop.getCost(id);
        if (!this.ap.spend(cost)) {
            this.hud.showMessage("Not enough AP!");
            return;
        }
        this.apShop.buy(id);
        this.refreshSlotLabels();
        this.refreshComboUpgrades();
        this.apShopWindow.updateAP(this.ap.getAvailable(), this.apShop);
        this.hud.showMessage(`Upgraded: ${id}!`);
    }

    private showStats(): void {
        const stats = this.statistics.getAll();
        const session = this.economy.getMoney() - this.sessionMoneyStart;
        this.statsWindow.show({
            lifetimeMoney: stats.totalMoneyEarned,
            lifetimeBalls: stats.totalBallsDropped,
            lifetimeGolden: stats.totalGoldenBallsDropped,
            lifetimeSlotHits: stats.totalSlotHits,
            lifetimePegBonuses: stats.totalPegBonuses,
            lifetimePurchases: stats.totalShopPurchases,
            bestHit: stats.bestSingleHit,
            bestCombo: stats.bestCombo,
            totalPlaySec: this.statistics.getTotalPlaySec(),
            sessionMoney: Math.max(0, session),
            sessionSec: this.statistics.getSessionSec(),
            sessionRate: this.economy.getRate(),
            money: this.economy.getMoney(),
            autoRate: this.autoDropper.getBallsPerSecond() * (1 + this.speed.getAutoBoostPct() / 100),
            autoBoost: this.speed.getAutoBoostPct(),
            multiplier: this.multiplier.getMultiplier(),
            incomeBoost: this.apShop.getIncomeBoostMult(),
            dailyStreak: this.dailyBonus.getStreak(),
        });
    }

    private showAchievements(): void {
        this.achievementsWindow.show(this.achievements.getStates(), this.ap.getTotal());
    }

    private showAPShop(): void {
        this.apShopWindow.show(this.apShop, this.ap.getAvailable());
    }

    private showDailyBonus(): void {
        const preview = this.dailyBonus.getBonusPreview(Math.max(0, this.economy.getRate()));
        this.dailyBonusWindow.show(this.dailyBonus, preview);
    }

    private claimDailyBonus(): void {
        if (!this.dailyBonus.canClaim()) return;
        const { amount, streak } = this.dailyBonus.claim();
        this.economy.addMoney(amount);
        this.statistics.addMoney(amount);
        this.hud.showMessage(`Daily bonus: +${fmt(amount)}  🔥 Day ${streak}!`);
        FloatingText.create(this, 640, 300, `+${fmt(amount)}`, "#f5c518", 30);
    }

    private updateHUD(time: number): void {
        const combo = this.combo.getCombo();
        const comboBonus = this.combo.getBonusPct();
        const maxCombo = 50 + this.apShop.getComboStackBonus();
        const comboFrac = combo / maxCombo;

        this.hud.update(
            this.economy.getMoney(),
            this.economy.getRate(),
            this.ballManager.getBallCount(),
            this.ballManager.getMaxBalls(),
            this.ap.getAvailable(),
            combo,
            comboBonus,
            comboFrac,
            this.dailyBonus.canClaim()
        );
    }

    private updateShop(): void {
        const autoBoost = 1 + this.speed.getAutoBoostPct() / 100;
        this.shop.update({
            autoDropperLevel: this.autoDropper.getLevel(),
            autoDropperCost: this.autoDropper.getCost(),
            autoDropperRate: this.autoDropper.getBallsPerSecond() * autoBoost,
            multiplierLevel: this.multiplier.getLevel(),
            multiplierVal: this.multiplier.getMultiplier(),
            multiplierCost: this.multiplier.getCost(),
            capacityLevel: this.ballCapacity.getLevel(),
            capacityVal: this.ballCapacity.getCapacity(),
            capacityCost: this.ballCapacity.getCost(),
            goldenLevel: this.goldenBall.getLevel(),
            goldenChance: this.goldenBall.getChancePct(),
            goldenCost: this.goldenBall.getCost(),
            luckyPegLevel: this.luckyPeg.getLevel(),
            luckyPegChance: this.luckyPeg.getChancePct(),
            luckyPegPower: this.luckyPeg.getPower(),
            luckyPegCost: this.luckyPeg.getCost(),
            speedLevel: this.speed.getLevel(),
            speedInterval: this.speed.getDropIntervalMs(),
            speedAutoBoost: this.speed.getAutoBoostPct(),
            speedCost: this.speed.getCost(),
            money: this.economy.getMoney(),
        });
    }

    private updateAchievements(time: number): void {
        if (time % 1000 > 100) return;

        this.achievements.update(
            this.statistics,
            this.autoDropper.getLevel(),
            this.combo.getCombo(),
            this.dailyBonus.getStreak(),
            this.totalPegBonusCount,
            (state, apAmount) => {
                this.ap.addAP(apAmount);
                this.hud.showMessage(`Achievement: ${state.def.title} Lv${state.currentMilestone}  +${apAmount} AP!`);
                FloatingText.create(this, 400, 250, `+${apAmount} AP`, "#aa88ff", 24);
            }
        );
    }

    private loadSave(): SaveData | null {
        const save = SaveManager.load();
        if (!save) return null;

        this.economy.setMoney(save.money);
        this.autoDropper.setLevel(save.autoDropperLevel);
        this.multiplier.setLevel(save.multiplierLevel);
        this.ballCapacity.setLevel(save.ballCapacityLevel);
        this.goldenBall.setLevel(save.goldenBallLevel);
        this.luckyPeg.setLevel(save.luckyPegLevel);
        this.speed.setLevel(save.speedLevel);
        this.apShop.setLevels(save.apShopLevels);
        this.statistics.setData({
            totalMoneyEarned: save.totalMoneyEarned,
            totalBallsDropped: save.totalBallsDropped,
            totalGoldenBallsDropped: save.totalGoldenBallsDropped,
            totalSlotHits: save.totalSlotHits,
            totalPegBonuses: save.totalPegBonuses,
            totalShopPurchases: save.totalShopPurchases,
            bestSingleHit: save.bestSingleHit,
            bestCombo: save.bestCombo,
            totalPlayTimeSec: save.totalPlayTimeSec,
        });
        this.ap.setData(save.totalAP, save.spentAP);
        this.achievements.setProgress(save.achievementProgress);
        this.dailyBonus.setData(save.lastDailyDate, save.dailyStreak);
        this.ballManager?.setMaxBalls(this.ballCapacity.getCapacity());

        return save;
    }

    private saveGame(): void {
        const stats = this.statistics.getAll();
        SaveManager.save({
            version: 4,
            money: this.economy.getMoney(),
            autoDropperLevel: this.autoDropper.getLevel(),
            multiplierLevel: this.multiplier.getLevel(),
            ballCapacityLevel: this.ballCapacity.getLevel(),
            goldenBallLevel: this.goldenBall.getLevel(),
            luckyPegLevel: this.luckyPeg.getLevel(),
            speedLevel: this.speed.getLevel(),
            apShopLevels: this.apShop.getLevels(),
            totalMoneyEarned: stats.totalMoneyEarned,
            totalBallsDropped: stats.totalBallsDropped,
            totalGoldenBallsDropped: stats.totalGoldenBallsDropped,
            totalSlotHits: stats.totalSlotHits,
            totalPegBonuses: stats.totalPegBonuses,
            totalShopPurchases: stats.totalShopPurchases,
            bestSingleHit: stats.bestSingleHit,
            bestCombo: stats.bestCombo,
            totalPlayTimeSec: this.statistics.getTotalPlaySec(),
            totalAP: this.ap.getTotal(),
            spentAP: this.ap.getSpent(),
            achievementProgress: this.achievements.getProgress(),
            lastDailyDate: this.dailyBonus.getLastDate(),
            dailyStreak: this.dailyBonus.getStreak(),
            lastSaveTime: Date.now(),
        });
    }

    private startAutosave(): void {
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => this.saveGame(),
        });
        window.addEventListener("beforeunload", () => this.saveGame());
    }

    private applyOfflineProgress(lastSaveTime: number): void {
        const offlineSec = Math.floor((Date.now() - lastSaveTime) / 1000);
        if (offlineSec < 30) return;

        const cappedSec = Math.min(offlineSec, 8 * 3600);
        const autoRate = this.autoDropper.getBallsPerSecond() * (1 + this.speed.getAutoBoostPct() / 100);
        if (autoRate <= 0) return;

        const avgSlot = SLOT_VALUES.reduce((a, b) => a + b, 0) / SLOT_VALUES.length;
        const mult = this.multiplier.getMultiplier();
        const apBoost = this.apShop.getIncomeBoostMult();

        const income = Math.floor(autoRate * avgSlot * mult * apBoost * cappedSec * 0.6);
        if (income <= 0) return;

        this.economy.addMoney(income);
        this.statistics.addMoney(income);

        const h = Math.floor(offlineSec / 3600);
        const m = Math.floor((offlineSec % 3600) / 60);
        const s = offlineSec % 60;

        const popup = this.add.text(640, 300, [
            "WELCOME BACK",
            "",
            `Away: ${h}h ${m}m ${s}s`,
            "",
            `Offline Earnings`,
            `+${fmt(income)}`,
        ].join("\n"), {
            fontFamily: "'Courier New', monospace",
            fontSize: "22px",
            color: "#ffffff",
            align: "center",
            backgroundColor: "#111a22",
            padding: { left: 24, right: 24, top: 18, bottom: 18 },
        }).setOrigin(0.5).setDepth(600);

        this.tweens.add({
            targets: popup,
            alpha: 0,
            delay: 4000,
            duration: 1000,
            onComplete: () => popup.destroy(),
        });
    }
}
