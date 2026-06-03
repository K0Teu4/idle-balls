import Phaser from "phaser";
import type { Achievement } from "../game/Achievement";
import { formatNumber } from "../utils/NumberFormatter";

const CARD_W = 388;

const CARD_H = 92;

export class AchievementItem extends Phaser.GameObjects.Container {

    private readonly titleText: Phaser.GameObjects.Text;

    private readonly rewardText: Phaser.GameObjects.Text;

    private readonly progressText: Phaser.GameObjects.Text;

    private readonly progressBarFill: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        achievement: Achievement
    ) {

        super(scene, x, y);

        const bg = scene.add
            .rectangle(0, 0, CARD_W, CARD_H, 0x222222, 1)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0x3a3a3a);

        this.titleText = scene.add.text(12, 10, achievement.title, {
            fontSize: "16px",
            color: "#ffffff",
            fontStyle: "bold"
        });

        const descText = scene.add.text(
            12,
            30,
            achievement.description,
            {
                fontSize: "12px",
                color: "#9a9a9a",
                wordWrap: { width: CARD_W - 24 }
            }
        );

        this.rewardText = scene.add.text(12, 50, "", {
            fontSize: "12px",
            color: "#d4af37"
        });

        this.progressText = scene.add.text(
            CARD_W - 12,
            50,
            "",
            {
                fontSize: "12px",
                color: "#cccccc",
                align: "right"
            }
        )
        .setOrigin(1, 0);

        scene.add
            .rectangle(12, 72, CARD_W - 24, 8, 0x333333)
            .setOrigin(0, 0);

        this.progressBarFill = scene.add
            .rectangle(12, 72, 0, 8, 0x3cb371)
            .setOrigin(0, 0);

        this.add([
            bg,
            this.titleText,
            descText,
            this.rewardText,
            this.progressText,
            this.progressBarFill
        ]);

        this.updateData(achievement);
    }

    updateData(achievement: Achievement): void {

        const progress = Math.min(
            achievement.current / achievement.target,
            1
        );

        this.progressText.setText(
            `${formatNumber(achievement.current)} / ${formatNumber(achievement.target)}`
        );

        this.rewardText.setText(
            `Lv ${achievement.level}  •  +${achievement.reward} AP`
        );

        this.progressBarFill.width = (CARD_W - 24) * progress;

        this.titleText.setColor(
            progress >= 1 ? "#6dffa8" : "#ffffff"
        );
    }
}
