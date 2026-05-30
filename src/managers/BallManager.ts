import Phaser from "phaser";
import { Ball } from "../game/Ball";

export class BallManager {

    private scene: Phaser.Scene;

    private balls: Ball[] = [];

    constructor(scene: Phaser.Scene) {

        this.scene = scene;
    }

    spawnBall(
        x: number,
        y: number
    ): Ball {

        const ball = new Ball(
            this.scene,
            x,
            y
        );

        this.balls.push(ball);

        return ball;
    }

    update(): void {

        for (const ball of this.balls) {

            ball.update();
        }

        this.balls = this.balls.filter(
            ball => !ball.destroyed
        );
    }

    getBalls(): Ball[] {

        return this.balls;
    }
}