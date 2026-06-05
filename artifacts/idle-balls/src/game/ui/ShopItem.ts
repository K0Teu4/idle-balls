import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { fmt } from "../utils/NumberFormat";

export class ShopItem {
    static readonly W = 320;
    static readonly H = 76;

    private bg: Phaser.GameObjects.Rectangle;
    private titleText: Phaser.GameObjects.Text;
    private infoText: Phaser.GameObjects.Text;
    private buyBtn: Phaser.GameObjects.Rectangle;
    private buyBtnText: Phaser.GameObjects.Text;
    private lvlBadge: Phaser.GameObjects.Text;
    private canAfford = true;

    constructor(
        scene: Phaser.Scene,
        x: number, y: number,
        title: string,
        color: string,
        onBuy: () => void,
        depth = 20
    ) {
        const W = ShopItem.W;
        const H = ShopItem.H;
        const cx = x + W / 2;

        this.bg = scene.add.rectangle(cx, y + H / 2, W, H, UIColors.panel)
            .setDepth(depth)
            .setStrokeStyle(1, UIColors.panelBorder);

        this.titleText = scene.add.text(x + 8, y + 5, title, {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color,
            fontStyle: "bold",
        }).setDepth(depth + 1);

        this.lvlBadge = scene.add.text(x + W - 8, y + 5, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            color: UIColors.textDim,
        }).setOrigin(1, 0).setDepth(depth + 1);

        this.infoText = scene.add.text(x + 8, y + 22, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            color: UIColors.textDim,
            lineSpacing: 1,
        }).setDepth(depth + 1);

        this.buyBtn = scene.add.rectangle(x + W - 40, y + H - 20, 68, 24, UIColors.button)
            .setDepth(depth + 1)
            .setStrokeStyle(1, 0x335577)
            .setInteractive({ useHandCursor: true });

        this.buyBtnText = scene.add.text(x + W - 40, y + H - 20, "BUY", {
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            color: "#ffffff",
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(depth + 2);

        this.buyBtn.on("pointerover", () => {
            if (this.canAfford) this.buyBtn.setFillStyle(UIColors.buttonHover);
        });
        this.buyBtn.on("pointerout", () => this.buyBtn.setFillStyle(this.canAfford ? UIColors.button : 0x2a2a2a));
        this.buyBtn.on("pointerup", () => { if (this.canAfford) onBuy(); });
    }

    setInfo(lines: string[], afford = true, level?: number): void {
        this.infoText.setText(lines.join("\n"));
        this.canAfford = afford;
        this.buyBtn.setFillStyle(afford ? UIColors.button : 0x2a2a2a);
        this.buyBtnText.setColor(afford ? "#ffffff" : "#555555");
        if (level !== undefined) {
            this.lvlBadge.setText(`Lv ${level}`);
        }
    }
}
