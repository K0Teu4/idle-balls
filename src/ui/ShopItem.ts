import Phaser from "phaser";

export class ShopItem {

    private background:
        Phaser.GameObjects.Rectangle;

    private titleText:
        Phaser.GameObjects.Text;

    private infoText:
        Phaser.GameObjects.Text;

    private buyButton:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,

        x: number,
        y: number,

        title: string,

        onBuy: () => void
    ) {

        this.background =
            scene.add.rectangle(
                x,
                y,
                240,
                150,
                0x202020
            )
            .setOrigin(0)
            .setStrokeStyle(
                2,
                0x444444
            );

        this.titleText =
            scene.add.text(
                x + 10,
                y + 10,
                title,
                {
                    fontSize: "22px",
                    color: "#ffffff"
                }
            );

        this.infoText =
            scene.add.text(
                x + 10,
                y + 45,
                "",
                {
                    fontSize: "18px",
                    color: "#cccccc"
                }
            );

        this.buyButton =
            scene.add.text(
                x + 10,
                y + 110,
                "BUY",
                {
                    fontSize: "22px",
                    color: "#ffffff",
                    backgroundColor: "#333333",
                    padding: {
                        left: 12,
                        right: 12,
                        top: 8,
                        bottom: 8
                    }
                }
            );

        this.buyButton
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerdown",
                onBuy
            );
    }

    setInfo(
        lines: string[]
    ): void {

        this.infoText.setText(
            lines.join("\n")
        );
    }
}