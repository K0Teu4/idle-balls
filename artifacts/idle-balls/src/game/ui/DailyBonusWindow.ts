import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { DailyBonusManager } from "../managers/DailyBonusManager";
import { fmt } from "../utils/NumberFormat";

export class DailyBonusWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private infoText!: Phaser.GameObjects.Text;
    private claimBtn!: Phaser.GameObjects.Rectangle;
    private claimBtnText!: Phaser.GameObjects.Text;
    private visible = false;

    constructor(
        scene: Phaser.Scene,
        onClaim: () => void
    ) {
        const d = 520;
        const pw = 440;
        const ph = 300;
        const px = 640;
        const py = 360;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 24, "DAILY BONUS", {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: UIColors.textGold,
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeBtn = scene.add.text(px + pw / 2 - 18, py - ph / 2 + 24, "✕", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeBtn.on("pointerup", () => this.hide());

        this.infoText = scene.add.text(px, py - 20, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "15px",
            color: UIColors.text,
            align: "center",
            lineSpacing: 8,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        this.claimBtn = scene.add.rectangle(px, py + 80, 180, 40, UIColors.buttonGold)
            .setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        this.claimBtnText = scene.add.text(px, py + 80, "CLAIM!", {
            fontFamily: "'Courier New', monospace",
            fontSize: "16px",
            color: "#ffffff",
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);

        this.claimBtn.on("pointerup", () => {
            onClaim();
            this.hide();
        });
        this.claimBtn.on("pointerover", () => this.claimBtn.setFillStyle(0xb8a000));
        this.claimBtn.on("pointerout", () => this.claimBtn.setFillStyle(UIColors.buttonGold));

        this.group = [overlay, panel, title, closeBtn, this.infoText, this.claimBtn, this.claimBtnText];
    }

    show(daily: DailyBonusManager, previewAmount: number): void {
        const streak = daily.getStreak();
        const can = daily.canClaim();
        const streakText = streak > 0
            ? `🔥 ${streak}-day streak!  (max ×4 at day 7)`
            : "Start a new streak!";

        const bonusText = can
            ? `Bonus: ${fmt(previewAmount)}`
            : "Already claimed today.";

        this.infoText.setText([
            streakText,
            "",
            bonusText,
            "",
            can ? "Come back tomorrow for more!" : `Next bonus tomorrow`
        ].join("\n"));

        this.claimBtn.setVisible(can);
        this.claimBtnText.setVisible(can);
        this.claimBtn.setFillStyle(UIColors.buttonGold);

        this.setVisible(true);
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
