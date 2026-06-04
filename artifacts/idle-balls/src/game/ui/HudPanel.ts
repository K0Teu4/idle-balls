import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { UIButton } from "./UIButton";
import { fmt, fmtRate, fmtPct } from "../utils/NumberFormat";

export class HudPanel {
    private moneyText: Phaser.GameObjects.Text;
    private rateText: Phaser.GameObjects.Text;
    private ballsText: Phaser.GameObjects.Text;
    private apText: Phaser.GameObjects.Text;
    private comboText: Phaser.GameObjects.Text;
    private comboBar: Phaser.GameObjects.Rectangle;
    private comboBg: Phaser.GameObjects.Rectangle;
    private messageText: Phaser.GameObjects.Text;
    private dropBtn: UIButton;
    private dailyBtn: UIButton;
    private dropBtnClickable = true;

    constructor(
        scene: Phaser.Scene,
        onDrop: () => void,
        onStats: () => void,
        onAchievements: () => void,
        onAPShop: () => void,
        onDailyBonus: () => void
    ) {
        const depth = 30;
        const x = 5;
        const W = 252;

        scene.add.rectangle(W / 2 + x - 2, 360, W + 4, 720, UIColors.panel)
            .setDepth(depth - 1)
            .setStrokeStyle(1, UIColors.panelBorder);

        scene.add.text(x + 5, 12, "IDLE BALLS", {
            fontFamily: "'Courier New', monospace",
            fontSize: "26px",
            color: UIColors.textGold,
            fontStyle: "bold",
        }).setDepth(depth);

        this.moneyText = scene.add.text(x + 5, 48, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: UIColors.money,
            fontStyle: "bold",
        }).setDepth(depth);

        this.rateText = scene.add.text(x + 5, 75, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.rate,
        }).setDepth(depth);

        this.ballsText = scene.add.text(x + 5, 95, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.textDim,
        }).setDepth(depth);

        this.apText = scene.add.text(x + 5, 113, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.apColor,
        }).setDepth(depth);

        scene.add.text(x + 5, 132, "COMBO", {
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            color: UIColors.textDim,
        }).setDepth(depth);

        this.comboText = scene.add.text(x + 50, 130, "×1", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.comboText,
            fontStyle: "bold",
        }).setDepth(depth);

        this.comboBg = scene.add.rectangle(x + 5 + 115, 145, 230, 8, 0x223344)
            .setDepth(depth);
        this.comboBar = scene.add.rectangle(x + 5, 145, 0, 8, UIColors.comboBar)
            .setOrigin(0, 0.5).setDepth(depth + 1);

        this.messageText = scene.add.text(x + 5, 158, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.moneyNeg,
        }).setDepth(depth);

        this.dropBtn = new UIButton(
            scene, x, 178, W, 40, "DROP BALL  (Space)",
            onDrop, UIColors.button, "14px", depth
        );

        this.dailyBtn = new UIButton(
            scene, x, 226, W, 34, "DAILY BONUS",
            onDailyBonus, UIColors.buttonGold, "13px", depth
        );

        new UIButton(scene, x, 268, W, 34, "STATISTICS", onStats, UIColors.buttonGreen, "13px", depth);
        new UIButton(scene, x, 310, W, 34, "ACHIEVEMENTS", onAchievements, UIColors.button, "13px", depth);
        new UIButton(scene, x, 352, W, 34, "AP SHOP", onAPShop, UIColors.buttonPurple, "13px", depth);
    }

    update(
        money: number,
        rate: number,
        balls: number,
        maxBalls: number,
        ap: number,
        combo: number,
        comboBonus: number,
        comboFrac: number,
        canClaim: boolean
    ): void {
        this.moneyText.setText(`Money: ${fmt(money)}`);
        this.rateText.setText(fmtRate(rate));
        this.ballsText.setText(`Balls: ${balls}/${maxBalls}`);
        this.apText.setText(`AP: ${fmt(ap)}`);
        
        if (combo > 1) {
            this.comboText.setText(`×${combo}  (+${comboBonus}%)`);
        } else {
            this.comboText.setText(`×1`);
        }

        const barW = Math.min(230, Math.floor(comboFrac * 230));
        this.comboBar.width = barW;

        this.dailyBtn.setAlpha(canClaim ? 1 : 0.4);
    }

    showMessage(msg: string): void {
        this.messageText.setText(msg);
        this.messageText.setAlpha(1);
        this.messageText.scene.tweens.add({
            targets: this.messageText,
            alpha: 0,
            delay: 2000,
            duration: 600,
        });
    }
}
