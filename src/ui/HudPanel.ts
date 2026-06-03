import Phaser from "phaser";
import { UIButton } from "./UIButton";
import { UIColors } from "./UIColors";
import { formatNumber } from "../utils/NumberFormatter";

export interface HudUpdateState {

    money: number;
    currentBalls: number;
    ap: number;
    maxBalls: number;
    ballCost: number;
    combo: number;
    comboBonusPercent: number;
    comboProgress: number;
    incomePerSec: number;
    dailyReady: boolean;
    dailyStreak: number;
}

/** Fixed vertical layout (y positions). */
const L = {
    title: 14,
    money: 52,
    income: 82,
    balls: 106,
    barBalls: 132,
    ap: 152,
    combo: 178,
    barCombo: 200,
    message: 218,
    drop: 248,
    daily: 300,
    stats: 348,
    achieve: 396,
    apShop: 444
} as const;

const BAR_W = 200;

export class HudPanel {

    private readonly root: Phaser.GameObjects.Container;

    private readonly moneyText: Phaser.GameObjects.Text;

    private readonly incomeText: Phaser.GameObjects.Text;

    private readonly ballsText: Phaser.GameObjects.Text;

    private readonly apText: Phaser.GameObjects.Text;

    private readonly comboText: Phaser.GameObjects.Text;

    private readonly capacityBar: Phaser.GameObjects.Rectangle;

    private readonly comboBar: Phaser.GameObjects.Rectangle;

    private readonly messageText: Phaser.GameObjects.Text;

    private readonly dailyButtonBg: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        onDropBall: () => void,
        onShowStatistics: () => void,
        onShowAchievements: () => void,
        onShowApShop: () => void,
        onClaimDaily: () => void
    ) {

        this.root = scene.add.container(0, 0);
        this.root.setDepth(50);

        const panelBg = scene.add.rectangle(
            8,
            8,
            228,
            492,
            0x141414,
            0.92
        )
        .setOrigin(0, 0)
        .setStrokeStyle(1, 0x333333);

        this.root.add(panelBg);

        this.root.add(
            scene.add.text(20, L.title, "IDLE BALLS", {
                fontSize: "26px",
                color: UIColors.text,
                fontStyle: "bold"
            })
        );

        this.moneyText = scene.add.text(20, L.money, "", {
            fontSize: "22px",
            color: UIColors.money
        });

        this.incomeText = scene.add.text(20, L.income, "", {
            fontSize: "14px",
            color: UIColors.secondaryText
        });

        this.ballsText = scene.add.text(20, L.balls, "", {
            fontSize: "16px",
            color: UIColors.secondaryText
        });

        this.root.add(
            scene.add.rectangle(
                20,
                L.barBalls,
                BAR_W,
                10,
                0x333333
            ).setOrigin(0, 0)
        );

        this.capacityBar = scene.add.rectangle(
            20,
            L.barBalls,
            0,
            10,
            0x44aa44
        ).setOrigin(0, 0);

        this.apText = scene.add.text(20, L.ap, "", {
            fontSize: "16px",
            color: "#d4af37"
        });

        this.comboText = scene.add.text(20, L.combo, "", {
            fontSize: "14px",
            color: UIColors.combo
        });

        this.root.add(
            scene.add.rectangle(
                20,
                L.barCombo,
                BAR_W,
                8,
                0x333333
            ).setOrigin(0, 0)
        );

        this.comboBar = scene.add.rectangle(
            20,
            L.barCombo,
            0,
            8,
            0xff66aa
        ).setOrigin(0, 0);

        this.messageText = scene.add.text(20, L.message, "", {
            fontSize: "15px",
            color: "#ff6666"
        });

        this.root.add([
            this.moneyText,
            this.incomeText,
            this.ballsText,
            this.capacityBar,
            this.apText,
            this.comboText,
            this.comboBar,
            this.messageText
        ]);

        new UIButton(
            scene,
            20,
            L.drop,
            200,
            42,
            "DROP BALL (Space)",
            onDropBall,
            this.root
        );

        this.dailyButtonBg = scene.add.rectangle(
            20,
            L.daily,
            200,
            38,
            UIColors.dailyReady
        )
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true });

        const dailyLabel = scene.add.text(
            120,
            L.daily + 19,
            "DAILY BONUS",
            { fontSize: "16px", color: "#ffffff" }
        )
        .setOrigin(0.5);

        this.dailyButtonBg.on("pointerup", onClaimDaily);

        this.root.add([this.dailyButtonBg, dailyLabel]);

        new UIButton(
            scene,
            20,
            L.stats,
            200,
            40,
            "STATISTICS",
            onShowStatistics,
            this.root
        );

        new UIButton(
            scene,
            20,
            L.achieve,
            200,
            40,
            "ACHIEVEMENTS",
            onShowAchievements,
            this.root
        );

        new UIButton(
            scene,
            20,
            L.apShop,
            200,
            40,
            "AP SHOP",
            onShowApShop,
            this.root
        );

    }

    update(state: HudUpdateState): void {

        this.moneyText.setText(
            `Money: ${formatNumber(state.money)}`
        );

        this.incomeText.setText(
            `~${formatNumber(state.incomePerSec)}/s`
        );

        this.ballsText.setText(
            `Balls: ${state.currentBalls}/${state.maxBalls}  •  ${formatNumber(state.ballCost)}/drop`
        );

        this.apText.setText(
            `AP: ${formatNumber(state.ap)}`
        );

        const ballRatio =
            state.maxBalls <= 0
                ? 0
                : state.currentBalls / state.maxBalls;

        this.capacityBar.width =
            BAR_W * Phaser.Math.Clamp(ballRatio, 0, 1);

        if (state.combo > 1) {

            this.comboText.setText(
                `Combo ×${state.combo}  (+${state.comboBonusPercent}%)`
            );

            this.comboBar.width =
                BAR_W *
                Phaser.Math.Clamp(state.comboProgress, 0, 1);
        }
        else {

            this.comboText.setText("Combo —");
            this.comboBar.width = 0;
        }

        this.dailyButtonBg.fillColor = state.dailyReady
            ? UIColors.dailyReady
            : 0x333333;
    }

    showMessage(message: string): void {

        this.messageText.setText(message);
        this.messageText.setAlpha(1);

        this.messageText.scene.tweens.add({
            targets: this.messageText,
            alpha: 0,
            delay: 1500,
            duration: 500
        });
    }
}
