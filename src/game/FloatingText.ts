import Phaser from "phaser";

export class FloatingText {

    static create(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        color = "#ffff00"
    ): void {

        const label =
            scene.add.text(
                x,
                y,
                text,
                {
                    fontSize: "24px",
                    color
                }
            )
            .setOrigin(0.5);

        scene.tweens.add({
            targets: label,

            y: y - 50,

            alpha: 0,

            duration: 1000,

            onComplete: () => {

                label.destroy();
            }
        });
    }
}