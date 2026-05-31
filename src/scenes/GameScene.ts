import Phaser from "phaser";

import { Peg } from "../game/Peg";
import { Slot } from "../game/Slot";
import { FloatingText } from "../game/FloatingText";
import { BallType } from "../game/BallType";

import {
    GAME_AREA,
    SLOT_HEIGHT,
    SLOT_VALUES
} from "../config/GameConfig";

import { EconomyManager } from "../managers/EconomyManager";
import { BallManager } from "../managers/BallManager";
import { AutoDropperManager } from "../managers/AutoDropperManager";
import { MultiplierManager } from "../managers/MultiplierManager";
import { BallCapacityManager } from "../managers/BallCapacityManager";
import { GoldenBallManager } from "../managers/GoldenBallManager";
import { SaveManager } from "../managers/SaveManager";

import { HudPanel } from "../ui/HudPanel";
import { ShopPanel } from "../ui/ShopPanel";

export class GameScene extends Phaser.Scene {

    private slots: Slot[] = [];

    private economy =
        new EconomyManager();

    private ballManager!:
        BallManager;

    private autoDropper =
        new AutoDropperManager();

    private multiplier =
        new MultiplierManager();

    private ballCapacity =
        new BallCapacityManager();

    private goldenBall =
        new GoldenBallManager();

    private hudPanel!:
        HudPanel;

    private shopPanel!:
        ShopPanel;

    private nextSpawnTime = 0;

    private nextAutoDrop = 0;

    private readonly BALL_COST = 1;

    create(): void {

        this.drawGameArea();

        this.createBackgroundDecor();

        this.createBounds();

        this.createPegs();

        this.createSlots();

        const offlineData =
            this.loadSave();

        this.ballManager =
            new BallManager(this);

        this.ballManager.setMaxBalls(
            this.ballCapacity.getCapacity()
        );

        this.hudPanel =
            new HudPanel(
                this,
                () => this.trySpawnBall()
            );

        this.shopPanel =
            new ShopPanel(
                this,
                () => this.buyAutoDropper(),
                () => this.buyMultiplier(),
                () => this.buyBallCapacity(),
                () => this.buyGoldenBall()
            );

        this.refreshSlotLabels();

        if (
            offlineData !== null
        ) {

            this.applyOfflineProgress(
                offlineData
            );
        }

        this.startAutosave();
    }

    update(): void {

        this.ballManager.update();

        this.checkBallsReachedBottom();

        this.updateHud();

        this.processAutoDropper();
    }

    private updateHud(): void {

        this.hudPanel.update(

            this.economy.getMoney(),

            this.ballManager.getBallCount(),

            this.ballManager.getMaxBalls()
        );

        this.shopPanel.update(

            this.autoDropper.getLevel(),
            this.autoDropper.getCost(),
            this.autoDropper.getBallsPerSecond(),

            this.multiplier.getLevel(),
            this.multiplier.getMultiplier(),
            this.multiplier.getCost(),

            this.ballCapacity.getLevel(),
            this.ballCapacity.getCapacity(),
            this.ballCapacity.getCost(),

            this.goldenBall.getLevel(),
            this.goldenBall.getChance(),
            this.goldenBall.getCost()
        );
    }

    private processAutoDropper(): void {

        const rate =
            this.autoDropper.getBallsPerSecond();

        if (
            rate <= 0
        ) {
            return;
        }

        if (
            this.time.now <
            this.nextAutoDrop
        ) {
            return;
        }

        if (
            !this.ballManager.canSpawnBall()
        ) {
            return;
        }

        if (
            !this.economy.spendMoney(
                this.BALL_COST
            )
        ) {
            return;
        }

        this.spawnBall();

        this.nextAutoDrop =
            this.time.now +
            1000 / rate;
    }

    private buyAutoDropper(): void {

        const cost =
            this.autoDropper.getCost();

        if (
            !this.economy.spendMoney(
                cost
            )
        ) {
            return;
        }

        this.autoDropper.buy();
    }

    private buyMultiplier(): void {

        const cost =
            this.multiplier.getCost();

        if (
            !this.economy.spendMoney(
                cost
            )
        ) {
            return;
        }

        this.multiplier.buy();

        this.refreshSlotLabels();
    }

    private buyBallCapacity(): void {

        const cost =
            this.ballCapacity.getCost();

        if (
            !this.economy.spendMoney(
                cost
            )
        ) {
            return;
        }

        this.ballCapacity.buy();

        this.ballManager.setMaxBalls(
            this.ballCapacity.getCapacity()
        );
    }

    private buyGoldenBall(): void {

        const cost =
            this.goldenBall.getCost();

        if (
            !this.economy.spendMoney(
                cost
            )
        ) {
            return;
        }

        this.goldenBall.buy();
    }

    private trySpawnBall(): void {

        if (
            this.time.now <
            this.nextSpawnTime
        ) {
            return;
        }

        if (
            !this.ballManager.canSpawnBall()
        ) {
            return;
        }

        if (
            !this.economy.spendMoney(
                this.BALL_COST
            )
        ) {
            return;
        }

        this.spawnBall();

        this.nextSpawnTime =
            this.time.now + 250;
    }

    private spawnBall(): boolean {

        const centerX =
            GAME_AREA.x +
            GAME_AREA.width / 2;

        const spawnX =
            centerX +
            Phaser.Math.Between(
                -20,
                20
            );

        const roll =
            Phaser.Math.Between(
                1,
                100
            );

        const type =
            roll <=
            this.goldenBall.getChance()

                ? BallType.Golden

                : BallType.Normal;

        const ball =
            this.ballManager.spawnBall(
                spawnX,
                GAME_AREA.y + 50,
                type
            );

        return ball !== null;
    }

    private drawGameArea(): void {

        this.add.rectangle(
            GAME_AREA.x +
            GAME_AREA.width / 2,

            GAME_AREA.y +
            GAME_AREA.height / 2,

            GAME_AREA.width,

            GAME_AREA.height,

            0x111111
        )
        .setStrokeStyle(
            2,
            0x555555
        );
    }

    private createBackgroundDecor(): void {

        for (
            let i = 0;
            i < 40;
            i++
        ) {

            this.add.circle(

                Phaser.Math.Between(
                    GAME_AREA.x,
                    GAME_AREA.x +
                    GAME_AREA.width
                ),

                Phaser.Math.Between(
                    GAME_AREA.y,
                    GAME_AREA.y +
                    GAME_AREA.height
                ),

                Phaser.Math.Between(
                    1,
                    2
                ),

                0xffffff,
                0.08
            );
        }
    }

    private createBounds(): void {

        const left =
            GAME_AREA.x;

        const right =
            GAME_AREA.x +
            GAME_AREA.width;

        const top =
            GAME_AREA.y;

        this.matter.add.rectangle(
            left,
            top +
            GAME_AREA.height / 2,
            20,
            GAME_AREA.height,
            {
                isStatic: true
            }
        );

        this.matter.add.rectangle(
            right,
            top +
            GAME_AREA.height / 2,
            20,
            GAME_AREA.height,
            {
                isStatic: true
            }
        );

        for (
            let i = 1;
            i < SLOT_VALUES.length;
            i++
        ) {

            const slotWidth =
                GAME_AREA.width /
                SLOT_VALUES.length;

            const dividerX =
                left +
                slotWidth * i;

            this.matter.add.rectangle(
                dividerX,
                GAME_AREA.y +
                GAME_AREA.height -
                SLOT_HEIGHT / 2,
                8,
                SLOT_HEIGHT,
                {
                    isStatic: true
                }
            );
        }
    }

    private createPegs(): void {

        const rows = 8;

        const spacingX = 80;

        const spacingY = 60;

        const startY = 140;

        const centerX =
            GAME_AREA.x +
            GAME_AREA.width / 2;

        for (
            let row = 0;
            row < rows;
            row++
        ) {

            const count =
                row + 1;

            for (
                let col = 0;
                col < count;
                col++
            ) {

                new Peg(
                    this,

                    centerX -
                    ((count - 1)
                    * spacingX) / 2 +
                    col * spacingX,

                    startY +
                    row * spacingY
                );
            }
        }
    }

    private createSlots(): void {

        const slotWidth =
            GAME_AREA.width /
            SLOT_VALUES.length;

        const slotY =
            GAME_AREA.y +
            GAME_AREA.height -
            SLOT_HEIGHT;

        for (
            let i = 0;
            i < SLOT_VALUES.length;
            i++
        ) {

            this.slots.push(
                new Slot(
                    this,
                    GAME_AREA.x +
                    slotWidth * i,
                    slotY,
                    slotWidth,
                    SLOT_HEIGHT,
                    SLOT_VALUES[i]
                )
            );
        }
    }

    private refreshSlotLabels(): void {

        const multiplier =
            this.multiplier.getMultiplier();

        for (
            const slot of this.slots
        ) {

            slot.updateLabel(
                multiplier
            );
        }
    }

    private checkBallsReachedBottom(): void {

        const slotLine =
            GAME_AREA.y +
            GAME_AREA.height -
            SLOT_HEIGHT;

        for (
            const ball of
            this.ballManager.getBalls()
        ) {

            if (
                ball.destroyed
            ) {
                continue;
            }

            if (
                ball.getY() <
                slotLine
            ) {
                continue;
            }

            const ballX =
                ball.getX();

            for (
                const slot of
                this.slots
            ) {

                if (
                    !slot.contains(
                        ballX
                    )
                ) {
                    continue;
                }

                let reward =
                    Math.round(
                        slot.value *
                        this.multiplier.getMultiplier()
                    );

                if (
                    ball.isGolden()
                ) {

                    reward =
                        Math.round(
                            reward *
                            this.goldenBall.getRewardMultiplier()
                        );

                    FloatingText.create(
                        this,
                        ballX,
                        slotLine - 50,
                        "GOLD!",
                        0xffdd33
                    );
                }

                this.economy.addMoney(
                    reward
                );

                FloatingText.create(
                    this,
                    ballX,
                    slotLine - 25,
                    `+${reward}`
                );

                ball.destroy(
                    this
                );

                break;
            }
        }
    }

    private applyOfflineProgress(
        lastSaveTime: number
    ): void {

        const maxSeconds =
            8 * 60 * 60;

        const secondsAway =
            Math.min(
                maxSeconds,
                Math.floor(
                    (
                        Date.now() -
                        lastSaveTime
                    ) / 1000
                )
            );

        if (
            secondsAway < 30
        ) {
            return;
        }

        const ballsProduced =
            secondsAway *
            this.autoDropper.getBallsPerSecond();

        const averageSlotReward =
            3.71;

        const multiplierBonus =
            this.multiplier.getMultiplier();

        const goldenBonus =
            1 +
            (
                this.goldenBall.getChance() /
                100
            ) *
            (
                this.goldenBall.getRewardMultiplier() - 1
            );

        const income =
            Math.floor(
                ballsProduced *
                averageSlotReward *
                multiplierBonus *
                goldenBonus
            );

        if (
            income <= 0
        ) {
            return;
        }

        this.economy.addMoney(
            income
        );

        this.showOfflinePopup(
            income,
            secondsAway
        );
    }

    private showOfflinePopup(
        income: number,
        secondsAway: number
    ): void {

        const text =
            this.add.text(
                640,
                300,
                [
                    "WELCOME BACK",
                    "",
                    `Away: ${this.formatOfflineTime(secondsAway)}`,
                    "",
                    `Offline Earnings`,
                    `+${income}`
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

            onComplete: () => {

                text.destroy();
            }
        });
    }

    private formatOfflineTime(
        seconds: number
    ): string {

        const hours =
            Math.floor(
                seconds / 3600
            );

        const minutes =
            Math.floor(
                (seconds % 3600) / 60
            );

        const secs =
            seconds % 60;

        return `${hours}h ${minutes}m ${secs}s`;
    }

    private saveGame(): void {

        SaveManager.save({

            version: 2,

            money:
                this.economy.getMoney(),

            autoDropperLevel:
                this.autoDropper.getLevel(),

            multiplierLevel:
                this.multiplier.getLevel(),

            ballCapacityLevel:
                this.ballCapacity.getLevel(),

            goldenBallLevel:
                this.goldenBall.getLevel(),

            lastSaveTime:
                Date.now()
        });
    }

    private loadSave(): number | null {

        const save =
            SaveManager.load();

        if (!save) {
            return null;
        }

        this.economy.setMoney(
            save.money
        );

        this.autoDropper.setLevel(
            save.autoDropperLevel
        );

        this.multiplier.setLevel(
            save.multiplierLevel
        );

        this.ballCapacity.setLevel(
            save.ballCapacityLevel
        );

        this.goldenBall.setLevel(
            save.goldenBallLevel
        );

        return save.lastSaveTime;
    }

    private startAutosave(): void {

        this.time.addEvent({

            delay: 5000,

            loop: true,

            callback: () => {

                this.saveGame();
            }
        });

        window.addEventListener(
            "beforeunload",
            () => {

                this.saveGame();
            }
        );
    }
}