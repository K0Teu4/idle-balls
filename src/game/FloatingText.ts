import Phaser from "phaser";
import { formatNumber } from "../utils/NumberFormatter";

export class FloatingText {

    static create(

        scene: Phaser.Scene,

        x: number,
        y: number,

        text: string,

        color = "#ffd700",

        size = 34
    ): void {

        const floatingText =
            scene.add.text(
                x,
                y,
                text,
                {
                    fontSize:
                        `${size}px`,

                    color
                }
            );

        floatingText.setOrigin(
            0.5
        );

        scene.tweens.add({

            targets:
                floatingText,

            y:
                y - 50,

            alpha: 0,

            duration: 900,

            onComplete: () => {

                floatingText.destroy();
            }
        });
    }
}