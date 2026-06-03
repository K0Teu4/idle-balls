import Phaser from "phaser";
import { UIColors } from "./UIColors";

export class ShopItem {

    private readonly container: Phaser.GameObjects.Container;

    private readonly panel: Phaser.GameObjects.Rectangle;

    private readonly infoText: Phaser.GameObjects.Text;

    private readonly buyBg: Phaser.GameObjects.Rectangle;

    private enabled = true;

    private readonly onBuy: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        title: string,
        titleColor: string,
        onBuy: () => void,
        height = 100,
        width = 280
    ) {

        this.onBuy = onBuy;
        this.container = scene.add.container(x, y);

        this.panel = scene.add.rectangle(
            0,
            0,
            width,
            height,
            UIColors.panel
        )
        .setOrigin(0)
        .setStrokeStyle(2, UIColors.panelBorder);

        const titleText = scene.add.text(12, 8, title, {
            fontSize: "19px",
            color: titleColor
        });

        this.infoText = scene.add.text(12, 34, "", {
            fontSize: "14px",
            color: UIColors.secondaryText,
            lineSpacing: 2
        });

        this.buyBg = scene.add.rectangle(
            width - 108,
            height - 34,
            96,
            26,
            UIColors.button
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        const buyLabel = scene.add.text(
            width - 60,
            height - 21,
            "BUY",
            { fontSize: "14px", color: "#ffffff" }
        )
        .setOrigin(0.5);

        this.buyBg.on("pointerup", () => {

            if (this.enabled) {
                this.onBuy();
            }
        });

        this.container.add([
            this.panel,
            titleText,
            this.infoText,
            this.buyBg,
            buyLabel
        ]);
    }

    getContainer(): Phaser.GameObjects.Container {

        return this.container;
    }

    setInfo(lines: string[]): void {

        this.infoText.setText(lines.join("\n"));
    }

    setAffordable(affordable: boolean): void {

        this.enabled = affordable;

        this.panel.setStrokeStyle(
            2,
            affordable ? UIColors.affordable : UIColors.panelBorder
        );

        this.buyBg.fillColor = affordable
            ? UIColors.button
            : UIColors.buttonDisabled;

        if (affordable) {
            this.buyBg.setInteractive({ useHandCursor: true });
        }
        else {
            this.buyBg.disableInteractive();
        }
    }
}
