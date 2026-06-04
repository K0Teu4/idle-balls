import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { UIButton } from "./UIButton";
import { fmt, fmtRate } from "../utils/NumberFormat";

export class HudPanel {
    private moneyText: Phaser.GameObjects.Text;
    private rateText: Phaser.GameObjects.Text;
    private ballsText: Phaser.GameObjects.Text;
    private apText: Phaser.GameObjects.Text;
    private prestigeText: Phaser.GameObjects.Text;
    private comboText: Phaser.GameObjects.Text;
    private comboBar: Phaser.GameObjects.Rectangle;
    private comboBg: Phaser.GameObjects.Rectangle;
    private messageText: Phaser.GameObjects.Text;
    private prestigeBtn: Phaser.GameObjects.Rectangle;
    private prestigeBtnText: Phaser.GameObjects.Text;
    private prestigeReady = false;

    constructor(
        scene: Phaser.Scene,
        onDrop: () => void,
        onStats: () => void,
        onAchievements: () => void,
        onAPShop: () => void,
        onDailyBonus: () => void,
        onPrestige: () => void
    ) {
        const depth = 30;
        const x = 5;
        const W = 252;

        scene.add.rectangle(W / 2 + x - 2, 360, W + 4, 720, UIColors.panel)
            .setDepth(depth - 1).setStrokeStyle(1, UIColors.panelBorder);

        scene.add.text(x + 5, 10, "IDLE BALLS", {
            fontFamily: "'Courier New', monospace", fontSize: "24px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setDepth(depth);

        this.moneyText = scene.add.text(x + 5, 44, "", {
            fontFamily: "'Courier New', monospace", fontSize: "20px",
            color: UIColors.money, fontStyle: "bold",
        }).setDepth(depth);

        this.rateText = scene.add.text(x + 5, 70, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.rate,
        }).setDepth(depth);

        this.ballsText = scene.add.text(x + 5, 88, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.textDim,
        }).setDepth(depth);

        this.apText = scene.add.text(x + 5, 106, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.apColor,
        }).setDepth(depth);

        this.prestigeText = scene.add.text(x + 5, 124, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#ff9944",
        }).setDepth(depth);

        scene.add.text(x + 5, 143, "COMBO", {
            fontFamily: "'Courier New', monospace", fontSize: "10px", color: UIColors.textDim,
        }).setDepth(depth);

        this.comboText = scene.add.text(x + 52, 141, "×1", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.comboText, fontStyle: "bold",
        }).setDepth(depth);

        this.comboBg = scene.add.rectangle(x + 5 + 115, 155, 230, 7, 0x223344).setDepth(depth);
        this.comboBar = scene.add.rectangle(x + 5, 155, 0, 7, UIColors.comboBar)
            .setOrigin(0, 0.5).setDepth(depth + 1);

        this.messageText = scene.add.text(x + 5, 166, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.moneyNeg,
        }).setDepth(depth);

        new UIButton(scene, x, 184, W, 40, "DROP BALL  (Space)", onDrop, UIColors.button, "14px", depth);

        const dailyBtn = new UIButton(scene, x, 232, W, 30, "DAILY BONUS", onDailyBonus, UIColors.buttonGold, "12px", depth);
        new UIButton(scene, x, 268, W, 30, "STATISTICS", onStats, UIColors.buttonGreen, "12px", depth);
        new UIButton(scene, x, 304, W, 30, "ACHIEVEMENTS", onAchievements, UIColors.button, "12px", depth);
        new UIButton(scene, x, 340, W, 30, "AP SHOP", onAPShop, UIColors.buttonPurple, "12px", depth);

        scene.add.rectangle(x + W / 2, 378, W, 1, UIColors.panelBorder).setDepth(depth);

        new UIButton(scene, x, 384, W, 30, "PRESTIGE SHOP", onPrestige, 0x7a3300, "12px", depth);

        this.prestigeBtn = scene.add.rectangle(x + W / 2, 426, W, 36, 0x333333)
            .setDepth(depth).setStrokeStyle(2, 0x554422)
            .setInteractive({ useHandCursor: true });
        this.prestigeBtnText = scene.add.text(x + W / 2, 426, "PRESTIGE", {
            fontFamily: "'Courier New', monospace", fontSize: "14px", color: "#666666", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(depth + 1);
        this.prestigeBtn.on("pointerup", () => { if (this.prestigeReady) onPrestige(); });
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
        canPrestige: boolean
    ): void {
        this.moneyText.setText(`${fmt(money)}`);
        this.rateText.setText(fmtRate(rate));
        this.ballsText.setText(`Balls: ${balls}/${maxBalls}   AP: ${fmt(ap)}`);
        this.apText.setText(`Prestige #${prestigeCount}  PP: ${fmt(prestigePP)}`);

        this.prestigeReady = canPrestige;
        if (canPrestige) {
            this.prestigeText.setText("⭐ PRESTIGE AVAILABLE!");
            this.prestigeBtn.setFillStyle(0xcc5500);
            this.prestigeBtn.setStrokeStyle(2, 0xff8800);
            this.prestigeBtnText.setColor("#ffffff");
        } else {
            this.prestigeText.setText("");
            this.prestigeBtn.setFillStyle(0x333333);
            this.prestigeBtn.setStrokeStyle(2, 0x554422);
            this.prestigeBtnText.setColor("#666666");
        }

        if (combo > 1) {
            this.comboText.setText(`×${combo}  (+${comboBonus}%)`);
        } else {
            this.comboText.setText("×1");
        }

        const barW = Math.min(230, Math.floor(comboFrac * 230));
        this.comboBar.width = barW;
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
