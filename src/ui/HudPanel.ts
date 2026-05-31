import Phaser from "phaser";

import { UIButton } from "./UIButton";
import { UIColors } from "./UIColors";

export class HudPanel {

    private moneyText:
        Phaser.GameObjects.Text;

    private ballsText:
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
}