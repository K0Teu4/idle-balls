import Phaser from "phaser";

export class Peg {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {

        scene.matter.add.circle(
            x,
            y,
            8,
            {
                isStatic: true,
                restitution: 1
            }
        );

        scene.add.circle(
            x,
            y,
            8,
            0xffffff
        );
    }
}