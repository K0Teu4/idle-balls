import Phaser from "phaser";

export class GoldenBurst {
    static create(scene: Phaser.Scene, x: number, y: number): void {
        for (let i = 0; i < 10; i++) {
            const p = scene.add.circle(x, y, Phaser.Math.Between(2, 5), 0xffd700).setDepth(190);
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const dist = Phaser.Math.Between(15, 45);
            scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scale: 0.3,
                duration: 400,
                onComplete: () => p.destroy()
            });
        }
    }
}
