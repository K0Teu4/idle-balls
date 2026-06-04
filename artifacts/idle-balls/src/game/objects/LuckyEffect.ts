import Phaser from "phaser";

export class LuckyEffect {
    static create(scene: Phaser.Scene, x: number, y: number): void {
        const colors = [0x00ff88, 0x00ffcc, 0x88ff00];
        for (let i = 0; i < 8; i++) {
            const color = colors[i % colors.length];
            const p = scene.add.circle(x, y, Phaser.Math.Between(2, 4), color).setDepth(191);
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const dist = Phaser.Math.Between(10, 35);
            scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                duration: 350,
                onComplete: () => p.destroy()
            });
        }
    }
}
