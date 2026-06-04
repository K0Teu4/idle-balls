import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { fmt, fmtRate } from "../utils/NumberFormat";

function secs(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h}h ${m}m ${ss}s`;
}

export class StatisticsWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private contentText!: Phaser.GameObjects.Text;
    private visible = false;

    constructor(scene: Phaser.Scene) {
        const d = 520;
        const pw = 560;
        const ph = 540;
        const px = 640;
        const py = 360;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 22, "STATISTICS", {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: UIColors.textGold,
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeBtn = scene.add.text(px + pw / 2 - 18, py - ph / 2 + 22, "✕", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeBtn.on("pointerup", () => this.hide());

        const sep = scene.add.rectangle(px, py - ph / 2 + 40, pw - 20, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        this.contentText = scene.add.text(px - pw / 2 + 16, py - ph / 2 + 52, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.text,
            lineSpacing: 4,
        }).setDepth(d + 1).setVisible(false);

        this.group = [overlay, panel, title, closeBtn, sep, this.contentText];
    }

    show(data: {
        lifetimeMoney: number;
        lifetimeBalls: number;
        lifetimeGolden: number;
        lifetimeSlotHits: number;
        lifetimePegBonuses: number;
        lifetimePurchases: number;
        bestHit: number;
        bestCombo: number;
        totalPlaySec: number;
        sessionMoney: number;
        sessionSec: number;
        sessionRate: number;
        money: number;
        autoRate: number;
        autoBoost: number;
        multiplier: number;
        incomeBoost: number;
        dailyStreak: number;
    }): void {
        const lines = [
            "── LIFETIME ────────────────────────",
            `Money earned       ${fmt(data.lifetimeMoney).padStart(16)}`,
            `Balls dropped      ${fmt(data.lifetimeBalls).padStart(16)}`,
            `Slot hits          ${fmt(data.lifetimeSlotHits).padStart(16)}`,
            `Golden balls       ${fmt(data.lifetimeGolden).padStart(16)}`,
            `Peg bonuses        ${fmt(data.lifetimePegBonuses).padStart(16)}`,
            `Shop purchases     ${data.lifetimePurchases.toString().padStart(16)}`,
            `Best single hit    ${fmt(data.bestHit).padStart(16)}`,
            `Best combo         ${"×" + data.bestCombo.toString().padStart(15)}`,
            `Play time          ${secs(data.totalPlaySec).padStart(16)}`,
            "",
            "── SESSION ─────────────────────────",
            `Earned             ${fmt(data.sessionMoney).padStart(16)}`,
            `Duration           ${secs(data.sessionSec).padStart(16)}`,
            `Income rate        ${fmtRate(data.sessionRate).padStart(16)}`,
            "",
            "── LIVE ────────────────────────────",
            `Money              ${fmt(data.money).padStart(16)}`,
            `Auto-drop          ${data.autoRate.toFixed(1).padStart(13) + "/s"}`,
            `Speed boost        ${("+" + data.autoBoost + "%").padStart(16)}`,
            `Multiplier         ${"×" + data.multiplier.toFixed(2).padStart(15)}`,
            `Income boost       ${"+" + ((data.incomeBoost - 1) * 100).toFixed(0) + "%"}`,
            `Daily streak       ${data.dailyStreak.toString().padStart(13) + " day(s)"}`,
        ];
        this.contentText.setText(lines.join("\n"));
        this.setVisible(true);
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
