import Phaser from "phaser";
import { Ball } from "../game/Ball";

export class BallManager {

    private scene: Phaser.Scene;

    private balls: Ball[] = [];

    private maxBalls = 100;

    constructor(
        scene: Phaser.Scene
    ) {

        this.scene = scene;
    }

    setMaxBalls(
        value: number
    ): void {

        this.maxBalls = value;
    }

    getMaxBalls(): number {

        return this.maxBalls;
    }

    getBallCount(): number {

        return this.balls.length;
    }

    canSpawnBall(): boolean {

        return (
            this.balls.length <
            this.maxBalls
        );
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