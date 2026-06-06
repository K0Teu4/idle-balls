import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { UIButton } from "./UIButton";
import { t } from "../i18n/Strings";
import { fmt, fmtRate } from "../utils/NumberFormat";

export class HudPanel {
    private moneyText: Phaser.GameObjects.Text;
    private rateText: Phaser.GameObjects.Text;
    private ballsText: Phaser.GameObjects.Text;
    private prestText: Phaser.GameObjects.Text;
    private comboLabel: Phaser.GameObjects.Text;
    private comboText: Phaser.GameObjects.Text;
    private comboBar: Phaser.GameObjects.Rectangle;
    private comboBg: Phaser.GameObjects.Rectangle;
    private messageText: Phaser.GameObjects.Text;
    private prestigeBtn: Phaser.GameObjects.Rectangle;
    private prestigeBtnText: Phaser.GameObjects.Text;
    private prestigeReqText: Phaser.GameObjects.Text;
    private prestigeReady = false;

    constructor(
        scene: Phaser.Scene,
        onDrop: () => void,
        onStats: () => void,
        onAchievements: () => void,
        onAPShop: () => void,
        onDailyBonus: () => void,
        onPrestige: () => void,
        onSettings: () => void,
        onHelp: () => void
    ) {
        const depth = 30;
        const x = 5;
        const W = 252;

        scene.add.rectangle(W / 2 + x - 2, 360, W + 4, 720, UIColors.panel)
            .setDepth(depth - 1).setStrokeStyle(1, UIColors.panelBorder);

        scene.add.text(x + 5, 8, t("title"), {
            fontFamily: "'Courier New', monospace", fontSize: "22px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setDepth(depth);

        this.moneyText = scene.add.text(x + 5, 40, "", {
            fontFamily: "'Courier New', monospace", fontSize: "22px",
            color: UIColors.money, fontStyle: "bold",
        }).setDepth(depth);

        this.rateText = scene.add.text(x + 5, 68, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.rate,
        }).setDepth(depth);

        this.ballsText = scene.add.text(x + 5, 84, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.textDim,
        }).setDepth(depth);

        this.prestText = scene.add.text(x + 5, 100, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#ff9944",
        }).setDepth(depth);

        // Combo section
        this.comboLabel = scene.add.text(x + 5, 119, t("combo_label"), {
            fontFamily: "'Courier New', monospace", fontSize: "10px", color: UIColors.textDim,
        }).setDepth(depth);

        this.comboText = scene.add.text(x + 56, 117, "×1", {
            fontFamily: "'Courier New', monospace", fontSize: "13px",
            color: UIColors.comboText, fontStyle: "bold",
        }).setDepth(depth);

        this.comboBg = scene.add.rectangle(x + 5 + W / 2 - 4, 136, W - 10, 10, 0x1a2233)
            .setOrigin(0.5).setDepth(depth);
        this.comboBar = scene.add.rectangle(x + 5, 136, 0, 10, UIColors.comboBar)
            .setOrigin(0, 0.5).setDepth(depth + 1);

        this.messageText = scene.add.text(x + 5, 150, "", {
            fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.moneyNeg,
            wordWrap: { width: W - 10 },
        }).setDepth(depth);

        // Buttons
        new UIButton(scene, x, 166, W, 40, t("drop_ball"), onDrop, UIColors.button, "13px", depth);
        new UIButton(scene, x, 210, W, 26, t("daily_bonus"), onDailyBonus, UIColors.buttonGold, "11px", depth);
        new UIButton(scene, x, 239, W, 26, t("statistics"), onStats, UIColors.buttonGreen, "11px", depth);
        new UIButton(scene, x, 268, W, 26, t("achievements"), onAchievements, UIColors.button, "11px", depth);
        new UIButton(scene, x, 297, W, 26, t("ap_shop"), onAPShop, UIColors.buttonPurple, "11px", depth);

        scene.add.rectangle(x + W / 2, 332, W, 1, UIColors.panelBorder).setDepth(depth);

        new UIButton(scene, x, 337, W, 26, t("prestige_shop"), onPrestige, 0x7a3300, "11px", depth);

        // Prestige button
        this.prestigeBtn = scene.add.rectangle(x + W / 2, 375, W, 30, 0x333333)
            .setDepth(depth).setStrokeStyle(2, 0x554422)
            .setInteractive({ useHandCursor: true });
        this.prestigeBtnText = scene.add.text(x + W / 2, 375, t("prestige_btn"), {
            fontFamily: "'Courier New', monospace", fontSize: "14px",
            color: "#666666", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(depth + 1);
        this.prestigeBtn.on("pointerup", () => { if (this.prestigeReady) onPrestige(); });
        this.prestigeBtn.on("pointerover", () => {
            if (this.prestigeReady) this.prestigeBtn.setFillStyle(0xff7700);
        });
        this.prestigeBtn.on("pointerout", () => {
            this.prestigeBtn.setFillStyle(this.prestigeReady ? 0xcc5500 : 0x333333);
        });

        // Prestige requirement text (below the button)
        this.prestigeReqText = scene.add.text(x + W / 2, 395, "", {
            fontFamily: "'Courier New', monospace", fontSize: "10px", color: "#886644",
        }).setOrigin(0.5).setDepth(depth);

        scene.add.rectangle(x + W / 2, 410, W, 1, UIColors.panelBorder).setDepth(depth);

        new UIButton(scene, x, 415, W, 26, t("settings"), onSettings, 0x2a3a2a, "11px", depth);
        new UIButton(scene, x, 444, W, 26, t("help_btn"), onHelp, 0x1a2a3a, "11px", depth);
    }

    update(
        money: number,
        rate: number,
        balls: number,
        maxBalls: number,
        ap: number,
        prestigeCount: number,
        prestigePP: number,
        combo: number,
        comboBonus: number,
        comboFrac: number,
        canClaim: boolean,
        canPrestige: boolean,
        prestigeNeeded: number
    ): void {
        this.moneyText.setText(fmt(money));
        this.rateText.setText(fmtRate(rate));
        this.ballsText.setText(`${t("balls_label")}: ${balls}/${maxBalls}   AP: ${fmt(ap)}`);
        this.prestText.setText(`${t("prestige_label")} #${prestigeCount}  ${t("pp_label")}: ${fmt(prestigePP)}`);

        this.prestigeReady = canPrestige;
        if (canPrestige) {
            this.messageText.setText("");
            this.prestigeBtn.setFillStyle(0xcc5500);
            this.prestigeBtn.setStrokeStyle(2, 0xff8800);
            this.prestigeBtnText.setColor("#ffffff");
            this.prestigeReqText.setText(t("hud_ready")).setColor("#ffaa44");
        } else {
            this.prestigeBtn.setFillStyle(0x333333);
            this.prestigeBtn.setStrokeStyle(2, 0x554422);
            this.prestigeBtnText.setColor("#666666");
            this.prestigeReqText.setText(`${t("hud_need")}: $${fmt(prestigeNeeded)} ${t("hud_more")}`).setColor("#776655");
        }

        // Combo display
        if (combo > 1) {
            this.comboText.setText(`×${combo}  (+${comboBonus}%)`);
            let barColor: number;
            if (combo <= 6) barColor = 0x3388ff;
            else if (combo <= 20) barColor = 0x33ddcc;
            else if (combo <= 40) barColor = 0xff8833;
            else barColor = 0xcc33ff;
            this.comboBar.setFillStyle(barColor);
            this.comboText.setColor(barColor === 0x3388ff ? UIColors.comboText :
                barColor === 0x33ddcc ? "#33ddcc" :
                barColor === 0xff8833 ? "#ff8833" : "#cc33ff");
        } else {
            this.comboText.setText("×1");
            this.comboText.setColor(UIColors.comboText);
            this.comboBar.setFillStyle(UIColors.comboBar);
        }

        const barW = Math.max(0, Math.floor(comboFrac * 242));
        this.comboBar.width = barW;

        // Daily bonus flash
        void canClaim;
    }

    showMessage(msg: string, color = UIColors.moneyNeg): void {
        this.messageText.setText(msg).setColor(color);
        this.messageText.setAlpha(1);
        this.messageText.scene.tweens.killTweensOf(this.messageText);
        this.messageText.scene.tweens.add({
            targets: this.messageText,
            alpha: 0,
            delay: 2500,
            duration: 600,
        });
    }
}
