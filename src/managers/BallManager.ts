import Phaser from "phaser";
import { Ball } from "../game/Ball";

export class BallManager {

    private readonly MAX_BALLS = 100;

    private scene: Phaser.Scene;

    private balls: Ball[] = [];

    constructor(
        scene: Phaser.Scene
    ) {
        this.scene = scene;
    }

    canSpawnBall(): boolean {

        return (
            this.balls.length <
            this.MAX_BALLS
        );
    }

    getBallCount(): number {

        return this.balls.length;
    }

    getMaxBalls(): number {

        return this.MAX_BALLS;
    }

    spawnBall(
        x: number,
        y: number
    ): Ball | null {

        if (
            !this.canSpawnBall()
        ) {
            return null;
        }

        const ball =
            new Ball(
                this.scene,
                x,
                y
            );

        this.balls.push(
            ball
        );

        return ball;
    }

    update(): void {

        for (
            const ball of
            this.balls
        ) {
            ball.update();
        }

        this.balls =
            this.balls.filter(
                ball =>
                    !ball.destroyed
            );
    }

    getBalls(): Ball[] {

        return this.balls;
    }
}