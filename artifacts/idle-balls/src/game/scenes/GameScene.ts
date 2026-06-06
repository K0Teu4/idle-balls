import Phaser from "phaser";

import { GAME_AREA, SLOT_VALUES, SLOT_HEIGHT, PEG_ROWS, PEG_SPACING_X, PEG_SPACING_Y, PEG_START_Y } from "../config/GameConfig";
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
import { PrestigeManager } from "../managers/PrestigeManager";
import { CritManager } from "../managers/CritManager";
import { DoubleStrikeManager } from "../managers/DoubleStrikeManager";
import { InsuranceManager } from "../managers/InsuranceManager";
import { BankManager } from "../managers/BankManager";
import { SaveManager, SaveData } from "../managers/SaveManager";
import { SettingsManager } from "../managers/SettingsManager";

import { HudPanel } from "../ui/HudPanel";
import { ShopPanel } from "../ui/ShopPanel";
import { HelpWindow } from "../ui/HelpWindow";
import { StatisticsWindow } from "../ui/StatisticsWindow";
import { AchievementsWindow } from "../ui/AchievementsWindow";
import { APShopWindow } from "../ui/APShopWindow";
import { DailyBonusWindow } from "../ui/DailyBonusWindow";
import { PrestigeWindow } from "../ui/PrestigeWindow";
import { SettingsWindow } from "../ui/SettingsWindow";
import { applyTheme } from "../ui/UIColors";

import { fmt } from "../utils/NumberFormat";

export class GameScene extends Phaser.Scene {
    // Core managers
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
    private prestige = new PrestigeManager();
    private crit = new CritManager();
    private doubleStrike = new DoubleStrikeManager();
    private insurance = new InsuranceManager();
    private bank = new BankManager();

    // Game objects
    private slots: Slot[] = [];
    private pegs: Peg[] = [];
    private pegBodyMap: Map<MatterJS.BodyType, Peg> = new Map();
    private processedBalls: Set<Ball> = new Set();

    // Star peg state
    private starActivePegs: Map<Peg, number> = new Map(); // peg → expiry time
    private nextStarPegTime = 0;

    // UI
    private hud!: HudPanel;
    private shop!: ShopPanel;
    private statsWindow!: StatisticsWindow;
    private achievementsWindow!: AchievementsWindow;
    private apShopWindow!: APShopWindow;
    private dailyBonusWindow!: DailyBonusWindow;
    private prestigeWindow!: PrestigeWindow;
    private settingsWindow!: SettingsWindow;
    private helpWindow!: HelpWindow;
    private fpsText?: Phaser.GameObjects.Text;

    // Timing & throttling
    private nextAutoDrop = 0;
    private nextManualDrop = 0;
    private nextAchievementCheck = 0;
    private frameCount = 0;
    private sessionMoneyStart = 0;

    // Stat tracking
    private totalPegBonusCount = 0;
    private critCount = 0;
    private starHitCount = 0;
    private doubleStrikeCount = 0;
    private showFloating = true;

    // Input
    private spaceKey?: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: "GameScene" });
    }

    create(): void {
        applyTheme();
        this.showFloating = SettingsManager.showFloatingText();
        if (SettingsManager.showFPS()) {
            this.fpsText = this.add.text(268, 4, "", {
                fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#aaffaa",
            }).setDepth(200);
        }
        this.drawBackground();
        this.createWalls();
        this.createPegs();
        this.createSlots();

        const save = this.loadSave();

        this.ballManager = new BallManager(this);
        this.ballManager.setMaxBalls(this.ballCapacity.getCapacity());
        this.refreshComboUpgrades();
        this.refreshCritUpgrades();

        this.hud = new HudPanel(
            this,
            () => this.tryDropBall(this.time.now),
            () => this.showStats(),
            () => this.showAchievements(),
            () => this.showAPShop(),
            () => this.showDailyBonus(),
            () => this.showPrestige(),
            () => this.showSettings(),
            () => this.helpWindow?.show()
        );

        this.shop = new ShopPanel(
            this,
            () => this.buy("autoDropper"),
            () => this.buy("multiplier"),
            () => this.buy("ballCapacity"),
            () => this.buy("goldenBall"),
            () => this.buy("luckyPeg"),
            () => this.buy("speed"),
            () => this.buy("doubleStrike"),
            () => this.buy("insurance"),
            () => this.buy("bank")
        );

        this.statsWindow = new StatisticsWindow(this);
        this.achievementsWindow = new AchievementsWindow(this);
        this.apShopWindow = new APShopWindow(this, this.apShop, (id) => this.buyAP(id));
        this.dailyBonusWindow = new DailyBonusWindow(this, () => this.claimDailyBonus());
        this.prestigeWindow = new PrestigeWindow(this, this.prestige, () => this.doPrestige());
        this.settingsWindow = new SettingsWindow(this, (key, val) => this.onSettingChanged(key, val));
        this.helpWindow = new HelpWindow(this);

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
        this.nextStarPegTime = this.time.now + 8000;

        if (this.dailyBonus.canClaim()) {
            this.time.delayedCall(900, () => this.showDailyBonus());
        }
    }

    update(time: number, delta: number): void {
        this.frameCount++;

        if (this.spaceKey?.isDown) {
            this.tryDropBall(time);
        }

        // Bank interest
        if (this.bank.getLevel() > 0) {
            const interest = this.bank.tick(this.economy.getMoney(), delta / 1000);
            if (interest > 0) {
                this.economy.addMoney(interest);
                this.statistics.addMoney(interest);
            }
        }

        // Always update physics
        this.ballManager.update();
        this.checkBallsBottom(time);
        this.processAutoDropper(time);

        // FPS counter
        if (this.fpsText) {
            this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
        }

        // Throttled UI updates for performance
        this.combo.update(time);
        this.economy.updateRate(time);

        if (this.frameCount % 3 === 0) this.updateHUD(time);
        if (this.frameCount % 6 === 0) this.updateShop();

        // Time-based updates
        if (time > this.nextAchievementCheck) {
            this.updateAchievements(time);
            this.nextAchievementCheck = time + 1500;
        }

        // Star peg system
        this.updateStarPegs(time);

        // Stuck ball cleanup every ~2s
        if (this.frameCount % 120 === 0) {
            this.checkStuckBalls(time);
        }
    }

    // ─── Background & Board ─────────────────────────────────

    private drawBackground(): void {
        const { x, y, width, height } = GAME_AREA;

        this.add.rectangle(0, 360, 262, 724, 0x0d1520).setOrigin(0, 0.5).setDepth(0);
        this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x0a1018)
            .setStrokeStyle(1, 0x1a2a3a).setDepth(0);
        this.add.rectangle(1280 - 170, 360, 340, 724, 0x0d1520).setOrigin(0.5).setDepth(0);

        for (let i = 0; i < 40; i++) {
            this.add.circle(
                Phaser.Math.Between(x + 5, x + width - 5),
                Phaser.Math.Between(y + 5, y + height - SLOT_HEIGHT - 5),
                Phaser.Math.Between(1, 2),
                0xffffff, 0.05
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
            this.add.rectangle(dx, dy, 3, SLOT_HEIGHT, 0x334455, 0.9).setDepth(6);
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
                const peg = new Peg(this, px, py);
                this.pegs.push(peg);
                this.pegBodyMap.set(peg.body, peg);
            }
        }
    }

    private createSlots(): void {
        const { x, y, width, height } = GAME_AREA;
        const slotW = width / SLOT_VALUES.length;
        const slotY = y + height - SLOT_HEIGHT;
        const centerIdx = Math.floor(SLOT_VALUES.length / 2);

        for (let i = 0; i < SLOT_VALUES.length; i++) {
            const slot = new Slot(this, x + slotW * i, slotY, slotW, SLOT_HEIGHT, SLOT_VALUES[i], i === centerIdx);
            this.slots.push(slot);
        }
    }

    private refreshSlotLabels(): void {
        const mult = this.multiplier.getMultiplier();
        const apBoost = this.apShop.getIncomeBoostMult();
        const prestigeMult = this.prestige.getGlobalIncomeMult();
        for (const slot of this.slots) slot.updateLabel(mult, apBoost * prestigeMult);
    }

    private refreshComboUpgrades(): void {
        this.combo.setAPUpgrades(
            this.apShop.getComboWindowBonus(),
            this.apShop.getComboStackBonus()
        );
    }

    private refreshCritUpgrades(): void {
        this.crit.setAPUpgrades(
            this.apShop.getCritChancePct(),
            this.apShop.getCritPowerBonus()
        );
    }

    // ─── Collision ──────────────────────────────────────────

    private handleCollision(bodyA: any, bodyB: any): void {
        let ballBody: any = null;
        let otherBody: any = null;

        if (bodyA.label === "ball" && bodyB.label === "peg") {
            ballBody = bodyA; otherBody = bodyB;
        } else if (bodyB.label === "ball" && bodyA.label === "peg") {
            ballBody = bodyB; otherBody = bodyA;
        } else {
            return;
        }

        const ball = this.ballManager.getBalls().find(b => b.body === ballBody);
        if (!ball || this.processedBalls.has(ball)) return;

        const peg = this.pegBodyMap.get(otherBody);
        if (!peg) return;

        peg.flash();

        // Star peg bonus
        if (peg.isStarPeg()) {
            const avgSlot = SLOT_VALUES.reduce((s, v) => s + v, 0) / SLOT_VALUES.length;
            const starBonus = Math.floor(
                avgSlot * this.multiplier.getMultiplier() * this.apShop.getIncomeBoostMult()
                * this.prestige.getGlobalIncomeMult() * 12
            );
            this.economy.addMoney(starBonus);
            this.statistics.addMoney(starBonus);
            this.starHitCount++;
            FloatingText.create(this, peg.x, peg.y - 18, `⭐ +${fmt(starBonus)}`, "#ffd700", 22);
            peg.setStar(false);
            this.starActivePegs.delete(peg);
        }

        // Lucky peg bonus
        const chancePct = this.luckyPeg.getChancePct();
        if (chancePct > 0 && Phaser.Math.Between(1, 10000) <= chancePct * 100) {
            const avgSlot = SLOT_VALUES.reduce((s, v) => s + v, 0) / SLOT_VALUES.length;
            const bonus = Math.floor(
                avgSlot * this.multiplier.getMultiplier() * this.apShop.getIncomeBoostMult()
                * this.prestige.getGlobalIncomeMult() * this.luckyPeg.getPower()
            );
            if (bonus > 0) {
                this.economy.addMoney(bonus);
                this.statistics.addMoney(bonus);
                this.statistics.addPegBonus(bonus);
                this.totalPegBonusCount++;
                LuckyEffect.create(this, peg.x, peg.y);
                FloatingText.create(this, peg.x, peg.y - 14, `+${fmt(bonus)}`, "#44ff99", 15);
            }
        }
    }

    // ─── Ball Logic ─────────────────────────────────────────

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
                    this.scheduleProcessedCleanup(ball);
                }
            }
        }
    }

    private onSlotHit(ball: Ball, slot: Slot, time: number): void {
        this.processedBalls.add(ball);

        const { combo, multiplier: comboMult } = this.combo.onSlotHit(time);
        const { isCrit, power: critPower } = this.crit.roll();

        const baseVal = slot.value * this.multiplier.getMultiplier();
        const apBoost = this.apShop.getIncomeBoostMult();
        const prestigeMult = this.prestige.getGlobalIncomeMult();
        const goldenBonus = ball.isGolden()
            ? this.goldenBall.getRewardMultiplier() * this.apShop.getGoldenRewardBonus()
            : 1;

        // Double Strike: chance to double income
        const isDouble = this.doubleStrike.roll();
        if (isDouble) this.doubleStrikeCount++;

        let income = Math.floor(baseVal * apBoost * comboMult * goldenBonus * critPower * prestigeMult);
        if (isDouble) income *= 2;

        this.economy.addMoney(income);
        this.statistics.addMoney(income);
        this.statistics.addSlotHit();
        this.statistics.trackHit(income);
        this.statistics.trackCombo(combo);

        if (isCrit) this.critCount++;

        const bx = ball.getX();
        const by = GAME_AREA.y + GAME_AREA.height - SLOT_HEIGHT / 2;

        if (this.showFloating) {
            if (isCrit) {
                FloatingText.create(this, bx, by - 35, `CRIT!`, "#ff4444", 20);
                FloatingText.create(this, bx, by - 15, `+${fmt(income)}`, "#ff8888", 28);
            } else if (isDouble) {
                FloatingText.create(this, bx, by - 35, `×2 STRIKE!`, "#ff6688", 18);
                FloatingText.create(this, bx, by - 15, `+${fmt(income)}`, "#ff99aa", 24);
            } else if (ball.isGolden()) {
                GoldenBurst.create(this, bx, by);
                FloatingText.create(this, bx, by - 20, `+${fmt(income)}`, "#ffd700", 26);
            } else {
                FloatingText.create(this, bx, by - 14, `+${fmt(income)}`, "#88ddff", 20);
            }
        } else if (ball.isGolden()) {
            GoldenBurst.create(this, bx, by);
        }

        // Insurance: refund on low-value slots (×1 or ×2)
        if (slot.value <= 2 && this.insurance.getLevel() > 0) {
            const refund = this.insurance.getRefundAmount(this.getBallCost());
            if (refund > 0) {
                this.economy.addMoney(refund);
                if (this.showFloating) {
                    FloatingText.create(this, bx, by - 55, `+${fmt(refund)} insur.`, "#44ccaa", 14);
                }
            }
        }

        slot.flash(this);

        // Multi-ball: chance to spawn extra ball for free
        const multiBallChance = this.apShop.getMultiBallChancePct();
        if (multiBallChance > 0 && Math.random() * 100 < multiBallChance) {
            this.time.delayedCall(80, () => this.spawnBall(true));
        }

        ball.destroy(this);
        this.scheduleProcessedCleanup(ball);
    }

    private scheduleProcessedCleanup(ball: Ball): void {
        this.time.delayedCall(50, () => this.processedBalls.delete(ball));
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

        const autoBoost = (1 + this.speed.getAutoBoostPct() / 100) * (1 + this.prestige.getAutoDropBoostPct() / 100);
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

    private spawnBall(free = false): void {
        const cx = GAME_AREA.x + GAME_AREA.width / 2;
        // Distribute across 18% of board width from center for varied ball paths
        const spread = Math.floor(GAME_AREA.width * 0.18);
        const spawnX = cx + Phaser.Math.Between(-spread, spread);
        const spawnY = GAME_AREA.y + Phaser.Math.Between(18, 32);

        const baseGoldenChance = this.goldenBall.getChancePct() + this.prestige.getBaseGoldenChancePct();
        const type = Phaser.Math.Between(1, 100) <= baseGoldenChance ? BallType.Golden : BallType.Normal;

        const ball = this.ballManager.spawnBall(spawnX, spawnY, type);
        if (ball) {
            this.statistics.addBall();
            if (type === BallType.Golden) this.statistics.addGoldenBall();
        }
    }

    private checkStuckBalls(time: number): void {
        const TIMEOUT_MS = 20_000;
        for (const ball of this.ballManager.getBalls()) {
            if (this.processedBalls.has(ball)) continue;
            if (time - ball.spawnTime > TIMEOUT_MS) {
                this.processedBalls.add(ball);
                ball.destroy(this);
                this.scheduleProcessedCleanup(ball);
            }
        }
    }

    // ─── Star Peg System ────────────────────────────────────

    private updateStarPegs(time: number): void {
        // Expire old stars
        for (const [peg, expiry] of this.starActivePegs) {
            if (time > expiry) {
                peg.setStar(false);
                this.starActivePegs.delete(peg);
            }
        }

        // Spawn new stars every 8s (max 3 active)
        if (time > this.nextStarPegTime && this.starActivePegs.size < 3) {
            const available = this.pegs.filter(p => !p.isStarPeg());
            if (available.length > 0) {
                const peg = available[Phaser.Math.Between(0, available.length - 1)];
                peg.setStar(true);
                this.starActivePegs.set(peg, time + 14_000);
            }
            this.nextStarPegTime = time + 8000;
        }
    }

    // ─── Shop & Upgrades ─────────────────────────────────────

    private buy(type: string): void {
        let cost = 0;
        switch (type) {
            case "autoDropper":   cost = this.autoDropper.getCost(); break;
            case "multiplier":    cost = this.multiplier.getCost(); break;
            case "ballCapacity":  cost = this.ballCapacity.getCost(); break;
            case "goldenBall":    cost = this.goldenBall.getCost(); break;
            case "luckyPeg":      cost = this.luckyPeg.getCost(); break;
            case "speed":         cost = this.speed.getCost(); break;
            case "doubleStrike":  cost = this.doubleStrike.getCost(); break;
            case "insurance":     cost = this.insurance.getCost(); break;
            case "bank":          cost = this.bank.getCost(); break;
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
            case "goldenBall":   this.goldenBall.buy(); break;
            case "luckyPeg":     this.luckyPeg.buy(); break;
            case "speed":        this.speed.buy(); break;
            case "doubleStrike": this.doubleStrike.buy(); break;
            case "insurance":    this.insurance.buy(); break;
            case "bank":         this.bank.buy(); break;
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
        this.refreshCritUpgrades();
        this.apShopWindow.updateAP(this.ap.getAvailable(), this.apShop);
        this.hud.showMessage(`Upgraded: ${id}!`, "#aaaaff");
    }

    // ─── Prestige ────────────────────────────────────────────

    private doPrestige(): void {
        if (!this.prestige.canPrestige(this.economy.getMoney())) {
            this.hud.showMessage("Not enough money to prestige!");
            return;
        }

        const moneyKept = this.economy.getMoney() * (this.prestige.getMoneyRetentionPct() / 100);
        const pp = this.prestige.doPrestige(this.economy.getMoney());

        // Apply retention to shop levels
        const retPct = this.prestige.getShopRetentionPct() / 100;
        const keep = (l: number) => Math.floor(l * retPct);

        this.autoDropper.setLevel(keep(this.autoDropper.getLevel()));
        this.multiplier.setLevel(keep(this.multiplier.getLevel()));
        this.ballCapacity.setLevel(keep(this.ballCapacity.getLevel()));
        this.goldenBall.setLevel(keep(this.goldenBall.getLevel()));
        this.luckyPeg.setLevel(keep(this.luckyPeg.getLevel()));
        this.speed.setLevel(keep(this.speed.getLevel()));
        this.doubleStrike.setLevel(keep(this.doubleStrike.getLevel()));
        this.insurance.setLevel(keep(this.insurance.getLevel()));
        this.bank.setLevel(keep(this.bank.getLevel()));

        // Reset money (keep wealth_guard portion)
        this.economy.setMoney(this.prestige.getStartingMoney());
        if (moneyKept > 0) this.economy.addMoney(moneyKept);

        // Reset auto dropper timing
        this.nextAutoDrop = this.time.now + 1000;
        this.nextManualDrop = 0;

        // Clear balls
        this.ballManager.destroyAll();
        this.ballManager.setMaxBalls(this.ballCapacity.getCapacity());

        // Clear star pegs
        for (const [peg] of this.starActivePegs) peg.setStar(false);
        this.starActivePegs.clear();
        this.nextStarPegTime = this.time.now + 8000;

        this.refreshSlotLabels();
        this.saveGame();

        this.hud.showMessage(`PRESTIGE! +${pp} PP earned!`, "#ff9944");
        FloatingText.create(this, 640, 280, `✦ PRESTIGE! +${pp} PP ✦`, "#ff9944", 32);
    }

    // ─── Windows ─────────────────────────────────────────────

    private showStats(): void {
        const stats = this.statistics.getAll();
        const session = this.economy.getMoney() - this.sessionMoneyStart;
        const autoBoost = (1 + this.speed.getAutoBoostPct() / 100) * (1 + this.prestige.getAutoDropBoostPct() / 100);
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
            autoRate: this.autoDropper.getBallsPerSecond() * autoBoost,
            autoBoost: Math.round((autoBoost - 1) * 100),
            multiplier: this.multiplier.getMultiplier(),
            incomeBoost: this.apShop.getIncomeBoostMult() * this.prestige.getGlobalIncomeMult(),
            dailyStreak: this.dailyBonus.getStreak(),
            prestigeCount: this.prestige.getCount(),
            prestigePP: this.prestige.getAvailablePP(),
            critCount: this.critCount,
            starHitCount: this.starHitCount,
            doubleStrikeCount: this.doubleStrikeCount,
        });
    }

    private showSettings(): void {
        this.settingsWindow.show();
    }

    private onSettingChanged(key: string, val: unknown): void {
        if (key === "showFloatingText") {
            this.showFloating = val as boolean;
        }
        if (key === "showFPS") {
            if (val) {
                if (!this.fpsText) {
                    this.fpsText = this.add.text(268, 4, "", {
                        fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#aaffaa",
                    }).setDepth(200);
                }
            } else {
                this.fpsText?.destroy();
                this.fpsText = undefined;
            }
        }
    }

    private showAchievements(): void {
        this.achievementsWindow.show(this.achievements.getStates(), this.ap.getTotal());
    }

    private showAPShop(): void {
        this.apShopWindow.show(this.apShop, this.ap.getAvailable());
    }

    private showDailyBonus(): void {
        const preview = this.dailyBonus.getBonusPreview(Math.max(1, this.economy.getRate()));
        this.dailyBonusWindow.show(this.dailyBonus, preview);
    }

    private showPrestige(): void {
        this.prestigeWindow.show(this.economy.getMoney());
    }

    private claimDailyBonus(): void {
        if (!this.dailyBonus.canClaim()) return;
        const { amount, streak } = this.dailyBonus.claim();
        this.economy.addMoney(amount);
        this.statistics.addMoney(amount);
        this.hud.showMessage(`Daily bonus: +${fmt(amount)}  🔥 Day ${streak}!`, "#f5c518");
        FloatingText.create(this, 590, 300, `+${fmt(amount)}`, "#f5c518", 30);
    }

    // ─── HUD & Shop Updates ──────────────────────────────────

    private updateHUD(_time: number): void {
        const combo = this.combo.getCombo();
        const comboBonus = this.combo.getBonusPct();
        const maxCombo = 50 + this.apShop.getComboStackBonus();
        const comboFrac = combo / maxCombo;
        const money = this.economy.getMoney();

        this.hud.update(
            money,
            this.economy.getRate(),
            this.ballManager.getBallCount(),
            this.ballManager.getMaxBalls(),
            this.ap.getAvailable(),
            this.prestige.getCount(),
            this.prestige.getAvailablePP(),
            combo,
            comboBonus,
            comboFrac,
            this.dailyBonus.canClaim(),
            this.prestige.canPrestige(money),
            Math.max(0, this.prestige.getRequirement() - money)
        );
    }

    private updateShop(): void {
        const autoBoost = (1 + this.speed.getAutoBoostPct() / 100) * (1 + this.prestige.getAutoDropBoostPct() / 100);
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
            goldenChance: this.goldenBall.getChancePct() + this.prestige.getBaseGoldenChancePct(),
            goldenCost: this.goldenBall.getCost(),
            luckyPegLevel: this.luckyPeg.getLevel(),
            luckyPegChance: this.luckyPeg.getChancePct(),
            luckyPegPower: this.luckyPeg.getPower(),
            luckyPegCost: this.luckyPeg.getCost(),
            speedLevel: this.speed.getLevel(),
            speedInterval: this.speed.getDropIntervalMs(),
            speedAutoBoost: Math.round((autoBoost - 1) * 100),
            speedCost: this.speed.getCost(),
            dsLevel: this.doubleStrike.getLevel(),
            dsChance: this.doubleStrike.getChancePct(),
            dsCost: this.doubleStrike.getCost(),
            insLevel: this.insurance.getLevel(),
            insRefund: this.insurance.getRefundPct(),
            insCost: this.insurance.getCost(),
            bankLevel: this.bank.getLevel(),
            bankInterest: this.bank.getInterestPct(),
            bankCost: this.bank.getCost(),
            multiplierNext: Math.pow(1.2, this.multiplier.getLevel() + 1),
            autoDropperNextRate: (this.autoDropper.getLevel() + 1) * autoBoost,
            money: this.economy.getMoney(),
        });
    }

    private updateAchievements(_time: number): void {
        this.achievements.update(
            this.statistics,
            this.autoDropper.getLevel(),
            this.combo.getCombo(),
            this.dailyBonus.getStreak(),
            this.totalPegBonusCount,
            this.prestige.getCount(),
            this.critCount,
            this.starHitCount,
            this.doubleStrikeCount,
            (state, apAmount) => {
                this.ap.addAP(apAmount);
                this.hud.showMessage(`Achievement: ${state.def.title} Lv${state.currentMilestone}  +${apAmount} AP!`, "#aa88ff");
                FloatingText.create(this, 590, 250, `+${apAmount} AP`, "#aa88ff", 24);
            }
        );
    }

    // ─── Save / Load ─────────────────────────────────────────

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
        this.doubleStrike.setLevel(save.doubleStrikeLevel);
        this.insurance.setLevel(save.insuranceLevel);
        this.bank.setLevel(save.bankLevel);
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
        this.prestige.setData(
            save.prestigeCount,
            save.prestigeTotalPP,
            save.prestigeSpentPP,
            save.prestigeShopLevels
        );
        this.critCount = save.critCount;
        this.starHitCount = save.starHitCount;
        this.doubleStrikeCount = save.doubleStrikeCount;
        this.totalPegBonusCount = save.totalPegBonusCount;

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
            doubleStrikeLevel: this.doubleStrike.getLevel(),
            insuranceLevel: this.insurance.getLevel(),
            bankLevel: this.bank.getLevel(),
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
            prestigeCount: this.prestige.getCount(),
            prestigeTotalPP: this.prestige.getTotalPP(),
            prestigeSpentPP: this.prestige.getSpentPP(),
            prestigeShopLevels: this.prestige.getLevels(),
            critCount: this.critCount,
            starHitCount: this.starHitCount,
            doubleStrikeCount: this.doubleStrikeCount,
            totalPegBonusCount: this.totalPegBonusCount,
        });
    }

    private startAutosave(): void {
        const intervalMs = SettingsManager.getAutosaveSec() * 1000;
        this.time.addEvent({
            delay: intervalMs,
            loop: true,
            callback: () => this.saveGame(),
        });
        window.addEventListener("beforeunload", () => this.saveGame());
    }

    private applyOfflineProgress(lastSaveTime: number): void {
        const offlineSec = Math.floor((Date.now() - lastSaveTime) / 1000);
        if (offlineSec < 30) return;

        const cappedSec = Math.min(offlineSec, 8 * 3600);
        const autoBoost = (1 + this.speed.getAutoBoostPct() / 100) * (1 + this.prestige.getAutoDropBoostPct() / 100);
        const autoRate = this.autoDropper.getBallsPerSecond() * autoBoost;
        if (autoRate <= 0) return;

        const avgSlot = SLOT_VALUES.reduce((a, b) => a + b, 0) / SLOT_VALUES.length;
        const income = Math.floor(
            autoRate * avgSlot
            * this.multiplier.getMultiplier()
            * this.apShop.getIncomeBoostMult()
            * this.prestige.getGlobalIncomeMult()
            * cappedSec * 0.6
        );
        if (income <= 0) return;

        this.economy.addMoney(income);
        this.statistics.addMoney(income);

        const h = Math.floor(offlineSec / 3600);
        const m = Math.floor((offlineSec % 3600) / 60);
        const s = offlineSec % 60;

        const popup = this.add.text(590, 310, [
            "WELCOME BACK",
            `Away: ${h}h ${m}m ${s}s`,
            `Offline: +${fmt(income)}`,
        ].join("\n"), {
            fontFamily: "'Courier New', monospace", fontSize: "20px",
            color: "#ffffff", align: "center",
            backgroundColor: "#111a22",
            padding: { left: 22, right: 22, top: 14, bottom: 14 },
        }).setOrigin(0.5).setDepth(600);

        this.tweens.add({
            targets: popup, alpha: 0, delay: 3500, duration: 800,
            onComplete: () => popup.destroy(),
        });
    }
}
