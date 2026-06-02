import Phaser from "phaser";
import type { Achievement } from "../game/Achievement";

export class AchievementItem extends Phaser.GameObjects.Container {
    private readonly progressText: Phaser.GameObjects.Text;

    private readonly titleText: Phaser.GameObjects.Text;

    private readonly descriptionText: Phaser.GameObjects.Text;

    private readonly rewardText: Phaser.GameObjects.Text;

    private readonly progressBarBackground: Phaser.GameObjects.Rectangle;

    private readonly progressBarFill: Phaser.GameObjects.Rectangle;

    private readonly widthValue = 310;

    private readonly heightValue = 110;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        achievement: Achievement
    ) {

        super(scene, x, y);

        const background =
            scene.add.rectangle(
                0,
                0,
                this.widthValue,
                100,
                0x222222
            )
            .setOrigin(0, 0);

        this.titleText =
            scene.add.text(
                10,
                8,
                achievement.title,
                {
                    fontSize: "18px",
                    color: "#ffffff"
                }
            );

        this.descriptionText =
            scene.add.text(
                10,
                32,
                achievement.description,
                {
                    fontSize: "14px",
                    color: "#aaaaaa"
                }
            );

        this.rewardText =
            scene.add.text(
                10,
                58,
                `Level ${achievement.level} • Reward: ${achievement.reward} AP`,
                {
                    fontSize: "12px",
                    color: "#ffd700"
                }
            );

        this.progressText =
            scene.add.text(
                200,
                58,
                " ",
                {
                    fontSize: "12px",
                    color: "#ffffff",
                    align: "right"
                }
            );

        this.progressBarBackground =
            scene.add.rectangle(
                10,
                86,
                300,
                8,
                0x444444
            )
            .setOrigin(0, 0);

        this.progressBarFill =
            scene.add.rectangle(
                10,
                86,
                0,
                8,
                0x00aa00
            )
            .setOrigin(0, 0);

        this.add(background);
        this.add(this.titleText);
        this.add(this.descriptionText);
        this.add(this.rewardText);
        this.add(this.progressText);
        this.add(this.progressBarBackground);
        this.add(this.progressBarFill);

        this.updateData(achievement);
    }

    updateData(
        achievement: Achievement
    ): void {

        const progress =
            Math.min(
                achievement.current /
                achievement.target,
                1
            );

        this.progressText.setText(
            `${this.formatNumber(achievement.current)} / ${this.formatNumber(achievement.target)}`
        );

        this.progressBarFill.width =
            300 * progress;

        if (
            achievement.current >=
            achievement.target
        ) {

            this.titleText.setColor("#66ff66");
        }
        else {

            this.titleText.setColor("#ffffff");
        }
    }

    private formatNumber(num: number): string {

        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + "B";
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(2) + "K";
        }

        return Math.floor(num).toString();
    }
}