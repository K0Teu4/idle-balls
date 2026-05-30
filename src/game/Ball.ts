import Phaser from "phaser";

export class Ball {

    body: MatterJS.BodyType;

    graphics: Phaser.GameObjects.Arc;

    destroyed = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {

        this.body = scene.matter.add.circle(
            x,
            y,
            10,
            {
                restitution: 0.95,
                friction: 0,
                frictionAir: 0.001
            }
        );

        const randomForce =
            Phaser.Math.FloatBetween(
                -0.002,
                0.002
            );

        scene.matter.body.applyForce(
            this.body,
            this.body.position,
            {
                x: randomForce,
                y: 0
            }
        );

        this.graphics = scene.add.circle(
            x,
            y,
            10,
            0xffcc00
        );
    }

    update(): void {

        if (this.destroyed) {
            return;
        }

        this.graphics.x =
            this.body.position.x;

        this.graphics.y =
            this.body.position.y;
    }

    destroy(scene: Phaser.Scene): void {

        if (this.destroyed) {
            return;
        }

        this.destroyed = true;

        scene.matter.world.remove(
            this.body
        );

        this.graphics.destroy();
    }

    getX(): number {

        return this.body.position.x;
    }

    getY(): number {

        return this.body.position.y;
    }
}