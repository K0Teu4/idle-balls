import Phaser from "phaser";

export class Slot {

    value: number;

    x: number;

    width: number;

    label:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        value: number
    ) {

        this.value = value;

        this.x = x;

        this.width = width;

        scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x222222
        );

        this.label =
            scene.add.text(
                x + width / 2,
                y + height / 2,
                `x${value}`,
                {
                    color: "#ffffff",
                    fontSize: "20px"
                }
            )
            .setOrigin(0.5);
    }

    updateLabel(
        multiplier: number
    ): void {

        const finalValue =
            (
                this.value *
                multiplier
            ).toFixed(2);

        this.label.setText(
            `x${finalValue}`
        );
    }

    contains(
        worldX: number
    ): boolean {

        return (
            worldX >= this.x &&
            worldX <
            this.x + this.width
        );
    }
}