import Phaser from "phaser";

import { UIButton } from "./UIButton";
import { UIColors } from "./UIColors";

export class HudPanel {

    private moneyText:
        Phaser.GameObjects.Text;

    private ballsText:
        Phaser.GameObjects.Text;

    private messageText:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,

        onDropBall: () => void
    ) {

        scene.add.text(
            20,
            20,
            "IDLE BALLS",
            {
                fontSize: "32px",
                color: UIColors.text
            }
        );

        this.moneyText =
            scene.add.text(
                20,
                90,
                "",
                {
                    fontSize: "26px",
                    color: UIColors.money
                }
            );

        this.ballsText =
            scene.add.text(
                20,
                130,
                "",
                {
                    fontSize: "20px",
                    color: UIColors.secondaryText
                }
            );

        this.messageText =
            scene.add.text(
                20,
                170,
                "",
                {
                    fontSize: "18px",
                    color: "#ff6666"
                }
            );

        new UIButton(
            scene,
            20,
            220,
            180,
            48,
            "DROP BALL",
            onDropBall
        );
    }

    update(
        money: number,

        currentBalls: number,

        maxBalls: number
    ): void {

        this.moneyText.setText(
            `Money: ${Math.floor(
                money
            )}`
        );

        this.ballsText.setText(
            `Balls: ${currentBalls}/${maxBalls}`
        );
    }

    showMessage(
        message: string
    ): void {

        this.messageText.setText(
            message
        );

        this.messageText.setAlpha(
            1
        );

        this.messageText.scene.tweens.add({

            targets:
                this.messageText,

            alpha: 0,

            delay: 1500,

            duration: 500
        });
    }
}