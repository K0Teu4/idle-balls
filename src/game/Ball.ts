import Phaser from "phaser";

import { BallType } from "./BallType";
import { EconomyConfig } from "../config/EconomyConfig";

export const BALL_BODY_LABEL = "ball";

export class Ball {

    body: MatterJS.BodyType;

    graphics: Phaser.GameObjects.Arc;

    destroyed = false;

    readonly type: BallType;

    private lastPegHitAt = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: BallType
    ) {

        this.type = type;

        this.body = scene.matter.add.circle(
            x,
            y,
            10,
            {
                restitution: 0.95,
                friction: 0,
                frictionAir: 0.001,
                label: BALL_BODY_LABEL
            }
        );

        scene.matter.body.applyForce(
            this.body,
            this.body.position,
            {
                x: Phaser.Math.FloatBetween(-0.002, 0.002),
                y: 0
            }
        );

        const isGolden =
            type === BallType.Golden;

        this.graphics = scene.add.circle(
            x,
            y,
            isGolden ? 12 : 10,
            isGolden ? 0xffd700 : 0xffcc00
        );

        if (isGolden) {
            this.graphics.setStrokeStyle(2, 0xffffff);
        }
    }

    update(): void {

        if (this.destroyed) {
            return;
        }

        this.graphics.x = this.body.position.x;
        this.graphics.y = this.body.position.y;
    }

    canHitPeg(): boolean {

        return (
            Date.now() - this.lastPegHitAt >=
            EconomyConfig.PEG_HIT_COOLDOWN_MS
        );
    }

    markPegHit(): void {

        this.lastPegHitAt = Date.now();
    }

    destroy(scene: Phaser.Scene): void {

        if (this.destroyed) {
            return;
        }

        this.destroyed = true;
        scene.matter.world.remove(this.body);
        this.graphics.destroy();
    }

    getX(): number {

        return this.body.position.x;
    }

    getY(): number {

        return this.body.position.y;
    }

    isGolden(): boolean {

        return this.type === BallType.Golden;
    }
}
