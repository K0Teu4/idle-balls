import Phaser from "phaser";

import { UIColors } from "./UIColors";

export class UIButton {

    private readonly background: Phaser.GameObjects.Rectangle;

    private enabled = true;

    private readonly callback: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        label: string,
        callback: () => void,
        parent?: Phaser.GameObjects.Container
    ) {

        this.callback = callback;

        this.background = scene.add.rectangle(
            x,
            y,
            width,
            height,
            UIColors.button
        )
        .setOrigin(0);

        const labelText = scene.add.text(
            x + width / 2,
            y + height / 2,
            label,
            {
                fontSize: "18px",
                color: "#ffffff"
            }
        )
        .setOrigin(0.5);

        if (parent) {
            parent.add([this.background, labelText]);
        }

        this.background
            .setInteractive({ useHandCursor: true })
            .on("pointerover", () => {

                if (!this.enabled) {
                    return;
                }

                this.background.fillColor =
                    UIColors.buttonHover;
            })
            .on("pointerout", () => {

                this.background.fillColor = this.enabled
                    ? UIColors.button
                    : UIColors.buttonDisabled;
            })
            .on("pointerup", () => {

                if (!this.enabled) {
                    return;
                }

                this.background.fillColor =
                    UIColors.buttonHover;

                this.callback();
            });
    }

    setEnabled(value: boolean): void {

        this.enabled = value;

        this.background.fillColor = value
            ? UIColors.button
            : UIColors.buttonDisabled;

        if (!value) {
            this.background.disableInteractive();
        }
        else {
            this.background.setInteractive({
                useHandCursor: true
            });
        }
    }
}
