import Phaser from "phaser";

export class FloatingText {

    static create(

        scene: Phaser.Scene,

        x: number,
        y: number,

        text: string
    ): void {

        const label =
            scene.add.text(
                x,
                y,
                text,
                {
                    fontSize: "28px",
                    color: "#f1c40f",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            )
            .setOrigin(0.5);

        scene.tweens.add({

            targets: label,

            y: y - 40,

            alpha: 0,

            scale: 1.3,

            duration: 700,

            ease: "Quad.Out",

            onComplete: () => {

                label.destroy();
            }
        });
    }
}