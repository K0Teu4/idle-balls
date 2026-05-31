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
            130,
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
                fontSize: "22px",
                color: titleColor
            }
        );

        this.infoText =
            scene.add.text(
                x + 12,
                y + 42,
                "",
                {
                    fontSize: "16px",
                    color: UIColors.secondaryText
                }
            );

        new UIButton(
            scene,
            x + 12,
            y + 92,
            100,
            28,
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