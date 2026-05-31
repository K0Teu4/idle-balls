import Phaser from "phaser";

import { UIColors } from "./UIColors";

export class UIButton {

    private background:
        Phaser.GameObjects.Rectangle;

    private text:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,

        x: number,
        y: number,

        width: number,
        height: number,

        label: string,

        callback: () => void
    ) {

        this.background =
            scene.add.rectangle(
                x,
                y,
                width,
                height,
                UIColors.button
            )
            .setOrigin(0);

        this.text =
            scene.add.text(
                x + width / 2,
                y + height / 2,
                label,
                {
                    fontSize: "20px",
                    color: "#ffffff"
                }
            )
            .setOrigin(0.5);

        this.background
            .setInteractive({
                useHandCursor: true
            })
            .on(
                "pointerover",
                () => {

                    this.background.fillColor =
                        UIColors.buttonHover;
                }
            )
            .on(
                "pointerout",
                () => {

                    this.background.fillColor =
                        UIColors.button;
                }
            )
            .on(
                "pointerdown",
                () => {

                    this.background.fillColor =
                        UIColors.buttonPressed;
                }
            )
            .on(
                "pointerup",
                () => {

                    this.background.fillColor =
                        UIColors.buttonHover;

                    callback();
                }
            );
    }
}