import Phaser from "phaser";
import { UIButton } from "./UIButton";
import { UIColors } from "./UIColors";
import { formatNumber } from "../utils/NumberFormatter";

export class HudPanel {

    private moneyText:
        Phaser.GameObjects.Text;

    private ballsText:
        Phaser.GameObjects.Text;

    private apText:
        Phaser.GameObjects.Text;

    private capacityBar:
        Phaser.GameObjects.Rectangle;

    private messageText:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,

        onDropBall: () => void,

        onShowStatistics: () => void,

        onShowAchievements: () => void
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

        this.apText =
            scene.add.text(
                20,
                190,
                "",
                {
                    fontSize: "20px",
                    color: "#d4af37"
                }
            );

        scene.add.rectangle(
            20,
            165,
            180,
            12,
            0x333333
        )
        .setOrigin(
            0,
            0
        );

        this.capacityBar =
            scene.add.rectangle(
                20,
                165,
                0,
                12,
                0x44aa44
            )
            .setOrigin(
                0,
                0
            );

        this.messageText =
            scene.add.text(
                20,
                220,
                "",
                {
                    fontSize: "18px",
                    color: "#ff6666"
                }
            );

        new UIButton(
            scene,
            20,
            270,
            180,
            48,
            "DROP BALL",
            onDropBall
        );

        new UIButton(
            scene,
            20,
            330,
            180,
            48,
            "STATISTICS",
            onShowStatistics
        );

        new UIButton(
            scene,
            20,
            390,
            180,
            48,
            "ACHIEVEMENTS",
            onShowAchievements
        );
    }

        update(
            money: number,
            currentBalls: number,
            ap: number,
            maxBalls: number
        ): void {

            this.moneyText.setText(
                `Money: ${formatNumber(money)}`
            );

        this.ballsText.setText(
            `Balls: ${currentBalls}/${maxBalls}`
        );

        this.apText.setText(
            `🏆 AP: ${ap}`
        );

        const ratio =
            maxBalls <= 0
                ? 0
                : currentBalls /
                  maxBalls;

        this.capacityBar.width =
            180 *
            Phaser.Math.Clamp(
                ratio,
                0,
                1
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