import Phaser from "phaser";
import { BallType } from "./BallType";
import { BALL_RADIUS, BALL_RESTITUTION, BALL_FRICTION_AIR } from "../config/GameConfig";

export class Ball {
    body: MatterJS.BodyType;
    graphics: Phaser.GameObjects.Arc;
    glowGraphics?: Phaser.GameObjects.Arc;
    destroyed = false;
    readonly type: BallType;

    constructor(scene: Phaser.Scene, x: number, y: number, type: BallType) {
        this.type = type;
        const isGolden = type === BallType.Golden;
        const radius = isGolden ? BALL_RADIUS + 2 : BALL_RADIUS;

        this.body = scene.matter.add.circle(x, y, radius, {
            restitution: BALL_RESTITUTION,
            friction: 0,
            frictionAir: BALL_FRICTION_AIR,
            label: "ball"
        });

        const force = Phaser.Math.FloatBetween(-0.0015, 0.0015);
        scene.matter.body.applyForce(this.body, this.body.position, { x: force, y: 0 });

        if (isGolden) {
            this.glowGraphics = scene.add.circle(x, y, radius + 5, 0xffd700, 0.25).setDepth(9);
        }

        this.graphics = scene.add.circle(x, y, radius, isGolden ? 0xffd700 : 0xf0c040).setDepth(10);
        if (isGolden) {
            this.graphics.setStrokeStyle(2, 0xffffff, 0.9);
        }
    }

    update(): void {
        if (this.destroyed) return;
        const x = this.body.position.x;
        const y = this.body.position.y;
        this.graphics.setPosition(x, y);
        if (this.glowGraphics) this.glowGraphics.setPosition(x, y);
    }

    destroy(scene: Phaser.Scene): void {
        if (this.destroyed) return;
        this.destroyed = true;
        scene.matter.world.remove(this.body);
        this.graphics.destroy();
        if (this.glowGraphics) this.glowGraphics.destroy();
    }

    getX(): number { return this.body.position.x; }
    getY(): number { return this.body.position.y; }
    isGolden(): boolean { return this.type === BallType.Golden; }
}
