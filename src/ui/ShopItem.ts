import Phaser from "phaser";

import { UIButton } from "./UIButton";
import { UIColors } from "./UIColors";

export class ShopItem {

    private infoText:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,

        x: number,
        y: number,

        title: string,

        titleColor: string,

        onBuy: () => void
    ) {

        scene.add.rectangle(
            x,
            y,
            260,
            160,
            UIColors.panel
        )
        .setOrigin(0)
        .setStrokeStyle(
            2,
            UIColors.panelBorder
        );

        scene.add.text(
            x + 12,
            y + 10,
            title,
            {
                fontSize: "24px",
                color: titleColor
            }
        );

        this.infoText =
            scene.add.text(
                x + 12,
                y + 50,
                "",
                {
                    fontSize: "18px",
                    color: UIColors.secondaryText
                }
            );

        new UIButton(
            scene,
            x + 12,
            y + 115,
            100,
            34,
            "BUY",
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