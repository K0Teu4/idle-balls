import Phaser from "phaser";

export const PEG_BODY_LABEL = "peg";

export class Peg {

    readonly body: MatterJS.BodyType;

    readonly x: number;

    readonly y: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {

        this.x = x;
        this.y = y;

        this.body = scene.matter.add.circle(
            x,
            y,
            8,
            {
                isStatic: true,
                restitution: 1,
                label: PEG_BODY_LABEL
            }
        );

        const graphic =
            scene.add.circle(
                x,
                y,
                8,
                0xffffff
            );

        graphic.setDepth(5);
    }
}
