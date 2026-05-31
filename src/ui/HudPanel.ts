import Phaser from "phaser";

export class HudPanel {

    private moneyText:
        Phaser.GameObjects.Text;

    private ballsText:
        Phaser.GameObjects.Text;

    constructor(
        private scene: Phaser.Scene,

        onDropBall: () => void
    ) {

        scene.add.text(
            20,
            20,
            "IDLE BALLS",
            {
                fontSize: "30px",
                color: "#ffffff"
            }
        );

        this.moneyText =
            scene.add.text(
                20,
                80,
                "",
                {
                    fontSize: "24px",
                    color: "#ffffff"
                }
            );

        this.ballsText =
            scene.add.text(
                20,
                120,
                "",
                {
                    fontSize: "20px",
                    color: "#cccccc"
                }
            );

        const dropButton =
            scene.add.text(
                20,
                200,
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

        dropButton
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerdown",
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