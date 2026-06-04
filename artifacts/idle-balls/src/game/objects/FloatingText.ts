import Phaser from "phaser";

const MAX_FLOATING = 20;
const active: Phaser.GameObjects.Text[] = [];

export class FloatingText {
    static create(
        scene: Phaser.Scene,
        x: number, y: number,
        text: string,
        color = "#ffd700",
        size = 22
    ): void {
        if (active.length >= MAX_FLOATING) return;

        const ft = scene.add.text(x, y, text, {
            fontFamily: "'Courier New', monospace",
            fontSize: `${size}px`,
            color,
            stroke: "#000000",
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(200).setAlpha(1);

        active.push(ft);

        scene.tweens.add({
            targets: ft,
            y: y - 55,
            alpha: 0,
            duration: 900,
            ease: "Cubic.Out",
            onComplete: () => {
                const idx = active.indexOf(ft);
                if (idx !== -1) active.splice(idx, 1);
                ft.destroy();
            }
        });
    }
}
