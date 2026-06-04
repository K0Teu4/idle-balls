import Phaser from "phaser";
import { PEG_RADIUS } from "../config/GameConfig";

export class Peg {
    readonly x: number;
    readonly y: number;
    readonly body: MatterJS.BodyType;

    private scene: Phaser.Scene;
    private gfx: Phaser.GameObjects.Arc;
    private highlight: Phaser.GameObjects.Arc;
    private starGlow?: Phaser.GameObjects.Arc;
    private starPulse?: Phaser.Tweens.Tween;
    private hitTween?: Phaser.Tweens.Tween;
    private starred = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.body = scene.matter.add.circle(x, y, PEG_RADIUS, {
            isStatic: true,
            restitution: 0.8,
            friction: 0,
            label: "peg"
        }) as MatterJS.BodyType;

        this.highlight = scene.add.circle(x, y, PEG_RADIUS + 5, 0xffffff, 0).setDepth(3);
        this.gfx = scene.add.circle(x, y, PEG_RADIUS, 0xd8d8d8).setDepth(4);
        this.gfx.setStrokeStyle(1, 0xffffff, 0.4);
    }

    flash(): void {
        if (this.hitTween) this.hitTween.stop();
        this.highlight.setAlpha(0.6);
        this.hitTween = this.scene.tweens.add({
            targets: this.highlight,
            alpha: 0,
            duration: 180,
        });
    }

    setStar(active: boolean): void {
        if (this.starred === active) return;
        this.starred = active;

        if (active) {
            this.gfx.setFillStyle(0xffd700);
            this.gfx.setStrokeStyle(2, 0xffffff, 0.9);
            this.starGlow = this.scene.add.circle(this.x, this.y, PEG_RADIUS + 10, 0xffd700, 0.2).setDepth(3);
            this.starPulse = this.scene.tweens.add({
                targets: this.starGlow,
                scaleX: 1.4, scaleY: 1.4,
                alpha: { from: 0.2, to: 0.5 },
                duration: 700,
                yoyo: true,
                repeat: -1,
            });
        } else {
            this.gfx.setFillStyle(0xd8d8d8);
            this.gfx.setStrokeStyle(1, 0xffffff, 0.4);
            this.starPulse?.stop();
            this.starPulse = undefined;
            this.starGlow?.destroy();
            this.starGlow = undefined;
        }
    }

    isStarPeg(): boolean { return this.starred; }
}
