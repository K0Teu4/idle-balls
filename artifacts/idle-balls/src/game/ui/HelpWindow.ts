import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { t } from "../i18n/Strings";

export class HelpWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private visible = false;

    constructor(scene: Phaser.Scene) {
        const d = 560;
        const pw = 720;
        const ph = 530;
        const px = 640;
        const py = 360;
        const L = px - pw / 2 + 16;
        const M = px + 10;
        const colW = pw / 2 - 30;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, 0xffd700).setVisible(false);

        const titleT = scene.add.text(px, py - ph / 2 + 18, `ℹ  ${t("help_title")}`, {
            fontFamily: "'Courier New', monospace", fontSize: "17px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);

        const closeX = scene.add.text(px + pw / 2 - 16, py - ph / 2 + 18, "✕", {
            fontFamily: "'Courier New', monospace", fontSize: "16px", color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false).setInteractive({ useHandCursor: true });
        closeX.on("pointerup", () => this.hide());

        const topSep = scene.add.rectangle(px, py - ph / 2 + 32, pw - 16, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        const midSep = scene.add.rectangle(px, py, 1, ph - 60, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        this.group.push(overlay, panel, titleT, closeX, topSep, midSep);

        const addSection = (x: number, y: number, hdrKey: string, bodyKey: string, hdrColor = UIColors.textGold): number => {
            const hdr = scene.add.text(x, y, t(hdrKey), {
                fontFamily: "'Courier New', monospace", fontSize: "11px",
                color: hdrColor, fontStyle: "bold",
            }).setDepth(d + 2).setVisible(false);
            this.group.push(hdr);

            const body = scene.add.text(x, y + 15, t(bodyKey), {
                fontFamily: "'Courier New', monospace", fontSize: "10px",
                color: UIColors.textDim,
                wordWrap: { width: colW },
                lineSpacing: 2,
            }).setDepth(d + 2).setVisible(false);
            this.group.push(body);

            return y + 15 + body.height + 10;
        };

        const top = py - ph / 2 + 42;

        // Left column
        let ly = addSection(L, top, "help_controls", "help_controls_d");
        ly = addSection(L, ly, "help_slots", "help_slots_d");
        ly = addSection(L, ly, "help_combo", "help_combo_d");
        ly = addSection(L, ly, "help_golden", "help_golden_d");

        // Right column
        let ry = addSection(M, top, "help_pegs", "help_pegs_d");
        ry = addSection(M, ry, "help_ap", "help_ap_d", UIColors.apColor);
        ry = addSection(M, ry, "help_prestige", "help_prestige_d", "#ff9944");
        addSection(M, ry, "help_specials", "help_specials_d", UIColors.rate);

        const hint = scene.add.text(px, py + ph / 2 - 13, t("help_close_hint"), {
            fontFamily: "'Courier New', monospace", fontSize: "9px", color: UIColors.textDim,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);
        this.group.push(hint);
    }

    show(): void {
        this.visible = true;
        for (const g of this.group) (g as any).setVisible(true);
    }

    hide(): void {
        this.visible = false;
        for (const g of this.group) (g as any).setVisible(false);
    }

    isVisible(): boolean { return this.visible; }
}
