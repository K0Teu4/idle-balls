import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { t } from "../i18n/Strings";
import { fmt, fmtRate } from "../utils/NumberFormat";

function secs(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${ss}s`;
    return `${ss}s`;
}

function pct(n: number): string {
    return `+${(n * 100).toFixed(0)}%`;
}

function bar(fraction: number, width = 16): string {
    const filled = Math.round(Math.max(0, Math.min(1, fraction)) * width);
    return "▓".repeat(filled) + "░".repeat(width - filled);
}

export class StatisticsWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private leftText!: Phaser.GameObjects.Text;
    private rightText!: Phaser.GameObjects.Text;
    private visible = false;

    constructor(scene: Phaser.Scene) {
        const d = 520;
        const pw = 660;
        const ph = 530;
        const px = 640;
        const py = 362;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.78)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 20, t("title_stats"), {
            fontFamily: "'Courier New', monospace", fontSize: "18px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeX = scene.add.text(px + pw / 2 - 16, py - ph / 2 + 20, "✕", {
            fontFamily: "'Courier New', monospace", fontSize: "16px", color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeX.on("pointerup", () => this.hide());

        const sep = scene.add.rectangle(px, py - ph / 2 + 38, pw - 16, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        const divider = scene.add.rectangle(px, py + 6, 1, ph - 50, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        const lx = px - pw / 2 + 14;
        const rx = px + 10;

        this.leftText = scene.add.text(lx, py - ph / 2 + 46, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px",
            color: UIColors.text, lineSpacing: 3,
        }).setDepth(d + 1).setVisible(false);

        this.rightText = scene.add.text(rx, py - ph / 2 + 46, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px",
            color: UIColors.text, lineSpacing: 3,
        }).setDepth(d + 1).setVisible(false);

        this.group = [overlay, panel, title, closeX, sep, divider, this.leftText, this.rightText];
    }

    show(data: {
        lifetimeMoney: number; lifetimeBalls: number; lifetimeGolden: number;
        lifetimeSlotHits: number; lifetimePegBonuses: number; lifetimePurchases: number;
        bestHit: number; bestCombo: number; totalPlaySec: number;
        sessionMoney: number; sessionSec: number; sessionRate: number;
        money: number; autoRate: number; autoBoost: number;
        multiplier: number; incomeBoost: number; dailyStreak: number;
        prestigeCount: number; prestigePP: number;
        critCount: number; starHitCount: number; doubleStrikeCount: number;
    }): void {
        const col1W = 26;
        const row = (label: string, val: string) =>
            `${label.padEnd(col1W - val.length > 0 ? label.length : col1W)} ${val}`;

        // Left column: lifetime + session
        const leftLines = [
            `─── ${t("sw_lifetime")} ───────────────`,
            row(t("sw_money"),     fmt(data.lifetimeMoney)),
            row(t("sw_balls"),     fmt(data.lifetimeBalls)),
            row(t("sw_hits"),      fmt(data.lifetimeSlotHits)),
            row(t("sw_golden"),    fmt(data.lifetimeGolden)),
            row(t("sw_crits"),     fmt(data.critCount)),
            row(t("sw_stars"),     fmt(data.starHitCount)),
            row("Double Strikes", fmt(data.doubleStrikeCount)),
            row(t("sw_peg_bonus"), fmt(data.lifetimePegBonuses)),
            row(t("sw_purchases"), String(data.lifetimePurchases)),
            row(t("sw_best_hit"),  fmt(data.bestHit)),
            row(t("sw_best_combo"),"×" + data.bestCombo),
            row(t("sw_play_time"), secs(data.totalPlaySec)),
            "",
            `─── ${t("sw_session")} ──────────────`,
            row(t("sw_earned"),    fmt(data.sessionMoney)),
            row(t("sw_duration"),  secs(data.sessionSec)),
            row(t("sw_rate"),      fmtRate(data.sessionRate)),
        ];

        // Right column: live stats + multipliers
        const totalMult = data.multiplier * data.incomeBoost;
        const goldenFraction = Math.min(1, data.lifetimeGolden / Math.max(1, data.lifetimeBalls));
        const critFraction = Math.min(1, data.critCount / Math.max(1, data.lifetimeSlotHits));

        const rightLines = [
            `─── ${t("sw_live")} ────────────────`,
            row("Money now",        fmt(data.money)),
            row(t("sw_auto_rate"),  data.autoRate.toFixed(1) + "/s"),
            row("Speed boost",      `+${data.autoBoost}%`),
            row(t("sw_multiplier"), `×${data.multiplier.toFixed(2)}`),
            row(t("sw_income_boost"),pct(data.incomeBoost - 1)),
            row("Total mult",       `×${totalMult.toFixed(2)}`),
            row(t("sw_prestige"),   String(data.prestigeCount)),
            row("Prestige PP",      fmt(data.prestigePP)),
            row(t("sw_streak"),     data.dailyStreak + " day(s)"),
            "",
            "─── EFFICIENCY ─────────────────",
            row("Golden rate", (goldenFraction * 100).toFixed(2) + "%"),
            `${bar(goldenFraction)} golden`,
            row("Crit rate",   (critFraction * 100).toFixed(2) + "%"),
            `${bar(critFraction)} crits`,
        ];

        this.leftText.setText(leftLines.join("\n"));
        this.rightText.setText(rightLines.join("\n"));
        this.setVisible(true);
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
