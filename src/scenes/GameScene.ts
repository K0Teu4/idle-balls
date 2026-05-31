import Phaser from "phaser";

import { Peg } from "../game/Peg";
import { Slot } from "../game/Slot";
import { FloatingText } from "../game/FloatingText";

import {
    GAME_AREA,
    SLOT_HEIGHT,
    SLOT_VALUES
} from "../config/GameConfig";

import { EconomyManager } from "../managers/EconomyManager";
import { BallManager } from "../managers/BallManager";
import { AutoDropperManager } from "../managers/AutoDropperManager";
import { MultiplierManager } from "../managers/MultiplierManager";
import { SaveManager } from "../managers/SaveManager";

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

    private moneyText!:
        Phaser.GameObjects.Text;

    private dropButton!:
        Phaser.GameObjects.Text;

    private autoDropperText!:
        Phaser.GameObjects.Text;

    private autoDropperButton!:
        Phaser.GameObjects.Text;

    private multiplierText!:
        Phaser.GameObjects.Text;

    private multiplierButton!:
        Phaser.GameObjects.Text;

    private nextSpawnTime = 0;

    private nextAutoDrop = 0;

    private readonly BALL_COST = 1;

    create(): void {

        this.drawGameArea();

        this.createBounds();

        this.createPegs();

        this.createSlots();

        this.createHud();

        this.loadSave();

        this.ballManager =
            new BallManager(this);

        this.refreshSlotLabels();

        this.startAutosave();
    }

    update(): void {

        this.ballManager.update();

        this.checkBallsReachedBottom();

        this.updateHud();

        this.processAutoDropper();
    }

    private updateHud(): void {

        this.moneyText.setText(
            `Money: ${Math.floor(
                this.economy.getMoney()
            )}`
        );

        this.autoDropperText.setText(
            [
                "Auto Dropper",
                `Level: ${this.autoDropper.getLevel()}`,
                `Cost: ${this.autoDropper.getCost()}`,
                `Rate: ${this.autoDropper.getBallsPerSecond()} balls/sec`
            ].join("\n")
        );

        this.multiplierText.setText(
            [
                "Income Multiplier",
                `Level: ${this.multiplier.getLevel()}`,
                `Value: x${this.multiplier.getMultiplier()}`,
                `Cost: ${this.multiplier.getCost()}`
            ].join("\n")
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
            !this.economy.spendMoney(
                this.BALL_COST
            )
        ) {
            return;
        }

        if (
            !this.ballManager.canSpawnBall()
        ) {
            return;
        }

        this.spawnBall();

        this.nextAutoDrop =
            this.time.now +
            1000 / rate;
    }

    private createHud(): void {

        this.moneyText =
            this.add.text(
                20,
                20,
                "",
                {
                    fontSize: "28px",
                    color: "#ffffff"
                }
            );

        this.dropButton =
            this.add.text(
                20,
                80,
                "DROP BALL (1)",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: {
                        left: 10,
                        right: 10,
                        top: 8,
                        bottom: 8
                    }
                }
            );

        this.dropButton
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerdown",
                () => {

                    this.trySpawnBall();
                }
            );

        this.add.text(
            1020,
            40,
            "SHOP",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        this.autoDropperText =
            this.add.text(
                980,
                100,
                "",
                {
                    fontSize: "20px",
                    color: "#ffffff"
                }
            );

        this.autoDropperButton =
            this.add.text(
                980,
                210,
                "BUY",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: {
                        left: 15,
                        right: 15,
                        top: 10,
                        bottom: 10
                    }
                }
            );

        this.autoDropperButton
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerdown",
                () => {

                    this.buyAutoDropper();
                }
            );

        this.multiplierText =
            this.add.text(
                980,
                320,
                "",
                {
                    fontSize: "20px",
                    color: "#ffffff"
                }
            );

        this.multiplierButton =
            this.add.text(
                980,
                430,
                "BUY",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: {
                        left: 15,
                        right: 15,
                        top: 10,
                        bottom: 10
                    }
                }
            );

        this.multiplierButton
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerdown",
                () => {

                    this.buyMultiplier();
                }
            );
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

    const ball =
        this.ballManager.spawnBall(
            spawnX,
            GAME_AREA.y + 50
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

            0x151515
        )
        .setStrokeStyle(
            2,
            0x444444
        );
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

                const reward =
                    Math.round(
                        slot.value *
                        this.multiplier.getMultiplier()
                    );

                this.economy.addMoney(
                    reward
                );

                FloatingText.create(
                    this,
                    ballX,
                    slotLine - 20,
                    `+${reward}`
                );

                ball.destroy(
                    this
                );

                break;
            }
        }
    }

    private saveGame(): void {

        SaveManager.save({

            version: 1,

            money:
                this.economy.getMoney(),

            autoDropperLevel:
                this.autoDropper.getLevel(),

            multiplierLevel:
                this.multiplier.getLevel(),

            lastSaveTime:
                Date.now()
        });
    }

    private loadSave(): void {

        const save =
            SaveManager.load();

        if (!save) {
            return;
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