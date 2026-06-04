import Phaser from "phaser";
import { PEG_RADIUS } from "../config/GameConfig";

export class Peg {
    private gfx: Phaser.GameObjects.Arc;
    private highlight: Phaser.GameObjects.Arc;
    private hitTween?: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        scene.matter.add.circle(x, y, PEG_RADIUS, {
            isStatic: true,
            restitution: 0.8,
            friction: 0,
            label: "peg"
        });

        this.highlight = scene.add.circle(x, y, PEG_RADIUS + 4, 0xffffff, 0).setDepth(3);
        this.gfx = scene.add.circle(x, y, PEG_RADIUS, 0xe0e0e0).setDepth(4);
        this.gfx.setStrokeStyle(1, 0xffffff, 0.5);
    }

    flash(scene: Phaser.Scene): void {
        if (this.hitTween) this.hitTween.stop();
        this.highlight.setAlpha(0.6);
        this.hitTween = scene.tweens.add({
            targets: this.highlight,
            alpha: 0,
            duration: 200,
        });
    }
}
