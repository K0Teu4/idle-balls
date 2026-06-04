import Phaser from "phaser";
import { BallType } from "./BallType";
import { BALL_RADIUS, BALL_RESTITUTION, BALL_FRICTION_AIR } from "../config/GameConfig";

export class Ball {
    body: MatterJS.BodyType;
    graphics: Phaser.GameObjects.Arc;
    glowGraphics?: Phaser.GameObjects.Arc;
    destroyed = false;
    spawnTime = 0;
    readonly type: BallType;

    constructor(scene: Phaser.Scene, x: number, y: number, type: BallType) {
        this.type = type;
        this.spawnTime = scene.time.now;
        const isGolden = type === BallType.Golden;
        const radius = isGolden ? BALL_RADIUS + 2 : BALL_RADIUS;

        this.body = scene.matter.add.circle(x, y, radius, {
            restitution: BALL_RESTITUTION,
            friction: 0,
            frictionAir: BALL_FRICTION_AIR,
            label: "ball"
        }) as MatterJS.BodyType;

        const forceX = Phaser.Math.FloatBetween(-0.004, 0.004);
        const forceY = 0.003;
        scene.matter.body.applyForce(this.body, this.body.position, { x: forceX, y: forceY });

        if (isGolden) {
            this.glowGraphics = scene.add.circle(x, y, radius + 6, 0xffd700, 0.22).setDepth(9);
        }

        this.graphics = scene.add.circle(x, y, radius, isGolden ? 0xffd700 : 0xe8c840).setDepth(10);
        if (isGolden) {
            this.graphics.setStrokeStyle(2, 0xffffff, 0.9);
        } else {
            this.graphics.setStrokeStyle(1, 0xffffff, 0.25);
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
