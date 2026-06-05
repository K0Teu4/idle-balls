import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { DailyBonusManager } from "../managers/DailyBonusManager";
import { t } from "../i18n/Strings";
import { fmt } from "../utils/NumberFormat";

const DAY_MULTS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];

export class DailyBonusWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private streakText!: Phaser.GameObjects.Text;
    private bonusText!: Phaser.GameObjects.Text;
    private countdownText!: Phaser.GameObjects.Text;
    private claimBtn!: Phaser.GameObjects.Rectangle;
    private claimBtnText!: Phaser.GameObjects.Text;
    private dayBoxes: Phaser.GameObjects.Rectangle[] = [];
    private dayLabels: Phaser.GameObjects.Text[] = [];
    private dayMultLabels: Phaser.GameObjects.Text[] = [];
    private checkmarks: Phaser.GameObjects.Text[] = [];
    private visible = false;

    constructor(scene: Phaser.Scene, onClaim: () => void) {
        const d = 520;
        const pw = 520;
        const ph = 370;
        const px = 640;
        const py = 362;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.78)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 20, t("title_daily"), {
            fontFamily: "'Courier New', monospace", fontSize: "18px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeX = scene.add.text(px + pw / 2 - 16, py - ph / 2 + 20, "✕", {
            fontFamily: "'Courier New', monospace", fontSize: "16px", color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeX.on("pointerup", () => this.hide());

        const sep = scene.add.rectangle(px, py - ph / 2 + 38, pw - 16, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        // ── 7-day streak calendar ──────────────────────────────
        const calY = py - ph / 2 + 50;
        const boxW = 62;
        const boxH = 68;
        const totalW = 7 * boxW + 6 * 2;
        const calStart = px - totalW / 2;

        for (let d2 = 0; d2 < 7; d2++) {
            const bx = calStart + d2 * (boxW + 2) + boxW / 2;
            const by = calY + boxH / 2;

            const box = scene.add.rectangle(bx, by, boxW, boxH, 0x1a2a1a)
                .setDepth(d + 1).setStrokeStyle(1, 0x333333).setVisible(false);
            this.dayBoxes.push(box);
            this.group.push(box);

            const dayT = scene.add.text(bx, calY + 6, `Day ${d2 + 1}`, {
                fontFamily: "'Courier New', monospace", fontSize: "9px", color: UIColors.textDim,
            }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
            this.dayLabels.push(dayT);
            this.group.push(dayT);

            const multT = scene.add.text(bx, calY + 28, `×${DAY_MULTS[d2].toFixed(1)}`, {
                fontFamily: "'Courier New', monospace", fontSize: "14px",
                color: UIColors.textGold, fontStyle: "bold",
            }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
            this.dayMultLabels.push(multT);
            this.group.push(multT);

            const check = scene.add.text(bx, calY + 50, "", {
                fontFamily: "'Courier New', monospace", fontSize: "18px", color: "#44ff88",
            }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
            this.checkmarks.push(check);
            this.group.push(check);
        }

        this.streakText = scene.add.text(px, calY + boxH + 14, "", {
            fontFamily: "'Courier New', monospace", fontSize: "14px",
            color: UIColors.text, align: "center",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        this.bonusText = scene.add.text(px, calY + boxH + 36, "", {
            fontFamily: "'Courier New', monospace", fontSize: "16px",
            color: UIColors.textGold, fontStyle: "bold", align: "center",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        this.countdownText = scene.add.text(px, calY + boxH + 58, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px",
            color: UIColors.textDim, align: "center",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const claimY = py + ph / 2 - 30;
        this.claimBtn = scene.add.rectangle(px, claimY, 210, 40, UIColors.buttonGold)
            .setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        this.claimBtnText = scene.add.text(px, claimY, t("dw_claim"), {
            fontFamily: "'Courier New', monospace", fontSize: "15px", color: "#fff", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        this.claimBtn.on("pointerup", () => { onClaim(); this.hide(); });
        this.claimBtn.on("pointerover", () => this.claimBtn.setFillStyle(0xb8a000));
        this.claimBtn.on("pointerout", () => this.claimBtn.setFillStyle(UIColors.buttonGold));

        this.group.push(
            overlay, panel, title, closeX, sep,
            this.streakText, this.bonusText, this.countdownText,
            this.claimBtn, this.claimBtnText
        );
    }

    show(daily: DailyBonusManager, previewAmount: number): void {
        const streak = daily.getStreak();
        const can = daily.canClaim();
        const currentDay = can ? streak : streak - 1; // index of CURRENT day (0-based)

        // Update calendar boxes
        for (let i = 0; i < 7; i++) {
            const completed = i < streak;
            const isToday = can && i === streak;
            const isCurrent = !can && i === streak - 1;

            if (completed) {
                this.dayBoxes[i].setFillStyle(0x1a4a1a).setStrokeStyle(2, 0x44ff88);
                this.checkmarks[i].setText("✓");
                this.dayMultLabels[i].setColor("#44ff88");
            } else if (isToday) {
                this.dayBoxes[i].setFillStyle(0x3a3a0a).setStrokeStyle(2, 0xffd700);
                this.checkmarks[i].setText("→");
                this.dayMultLabels[i].setColor(UIColors.textGold);
            } else if (isCurrent) {
                this.dayBoxes[i].setFillStyle(0x2a2a1a).setStrokeStyle(2, 0x888844);
                this.checkmarks[i].setText("✓");
                this.dayMultLabels[i].setColor("#cccc44");
            } else {
                this.dayBoxes[i].setFillStyle(0x101a10).setStrokeStyle(1, 0x333333);
                this.checkmarks[i].setText("");
                this.dayMultLabels[i].setColor(UIColors.textDim);
            }
        }

        const streakEmoji = streak >= 7 ? "🔥🔥🔥" : streak >= 3 ? "🔥🔥" : streak >= 1 ? "🔥" : "";
        this.streakText.setText(streak > 0
            ? `${streakEmoji} ${streak}-day streak! Keep going!`
            : `${t("dw_new_streak")} Claim every day for bigger rewards!`
        );

        if (can) {
            const mult = DAY_MULTS[Math.min(streak, 6)];
            this.bonusText.setText(`Today's bonus: ${fmt(previewAmount)}  (×${mult.toFixed(1)} multiplier)`);
            this.countdownText.setText("Come back tomorrow for an even bigger reward!");
        } else {
            this.bonusText.setText(t("dw_claimed"));
            // Simple "next bonus" info
            this.countdownText.setText(t("dw_tomorrow"));
        }

        this.claimBtn.setVisible(can);
        this.claimBtnText.setVisible(can);

        this.setVisible(true);
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
