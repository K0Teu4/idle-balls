import Phaser from "phaser";
import { UIColors } from "./UIColors";

export class UIButton {
    private bg: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;
    private baseColor: number;

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        w: number, h: number,
        label: string,
        onClick: () => void,
        color: number = UIColors.button,
        fontSize = "14px",
        depth = 50
    ) {
        this.baseColor = color;

        this.bg = scene.add.rectangle(x + w / 2, y + h / 2, w, h, color)
            .setDepth(depth)
            .setStrokeStyle(1, 0x334455)
            .setInteractive({ useHandCursor: true });

        this.text = scene.add.text(x + w / 2, y + h / 2, label, {
            fontFamily: "'Courier New', monospace",
            fontSize,
            color: UIColors.text,
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(depth + 1);

        this.bg.on("pointerover", () => {
            this.bg.setFillStyle(color + 0x101010 > 0xffffff ? color : color + 0x101010);
        });
        this.bg.on("pointerout", () => this.bg.setFillStyle(color));
        this.bg.on("pointerdown", () => this.bg.setFillStyle(Math.max(0, color - 0x0a0a0a)));
        this.bg.on("pointerup", () => {
            this.bg.setFillStyle(color);
            onClick();
        });
    }

    setLabel(s: string): void { this.text.setText(s); }
    setVisible(v: boolean): void { this.bg.setVisible(v); this.text.setVisible(v); }
    setAlpha(a: number): void { this.bg.setAlpha(a); this.text.setAlpha(a); }
    setDepth(d: number): void { this.bg.setDepth(d); this.text.setDepth(d + 1); }
}
