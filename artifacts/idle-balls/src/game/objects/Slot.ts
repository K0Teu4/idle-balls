import Phaser from "phaser";
import { fmt } from "../utils/NumberFormat";

export class Slot {
    value: number;
    x: number;
    width: number;
    label: Phaser.GameObjects.Text;
    bg: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        width: number, height: number,
        value: number,
        isCenter: boolean
    ) {
        this.value = value;
        this.x = x;
        this.width = width;

        const cx = x + width / 2;
        const cy = y + height / 2;

        const color = isCenter ? 0x2a4f8a : 0x1e2a3a;
        const borderColor = isCenter ? 0x4488ff : 0x445566;

        this.bg = scene.add.rectangle(cx, cy, width - 2, height, color)
            .setDepth(5)
            .setStrokeStyle(1, borderColor);

        this.label = scene.add.text(cx, cy, `x${value}`, {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: isCenter ? "#88bbff" : "#aabbcc",
            fontStyle: "bold"
        }).setOrigin(0.5).setDepth(6);
    }

    updateLabel(multiplier: number, apBoost: number): void {
        const effective = this.value * multiplier * apBoost;
        let text: string;
        if (effective < 1000) {
            text = `x${effective.toFixed(effective < 10 ? 2 : 1)}`;
        } else {
            text = `x${fmt(effective)}`;
        }
        this.label.setText(text);
    }

    flash(scene: Phaser.Scene): void {
        scene.tweens.add({
            targets: this.bg,
            fillColor: { from: 0x4488ff, to: this.bg.fillColor },
            duration: 250,
        });
    }

    contains(worldX: number): boolean {
        return worldX >= this.x && worldX < this.x + this.width;
    }
}
