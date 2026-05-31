import Phaser from "phaser";

export class GoldenBurst {

    static create(
        scene: Phaser.Scene,
        x: number,
        y: number
    ): void {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const particle =
                scene.add.circle(
                    x,
                    y,
                    Phaser.Math.Between(
                        2,
                        4
                    ),
                    0xffd700
                );

            const angle =
                Phaser.Math.FloatBetween(
                    0,
                    Math.PI * 2
                );

            const distance =
                Phaser.Math.Between(
                    20,
                    50
                );

            scene.tweens.add({

                targets:
                    particle,

                x:
                    x +
                    Math.cos(angle)
                    * distance,

                y:
                    y +
                    Math.sin(angle)
                    * distance,

                alpha: 0,

                scale: 0.5,

                duration: 450,

                onComplete: () => {

                    particle.destroy();
                }
            });
        }
    }
}