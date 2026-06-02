import Phaser from "phaser";
import type { Achievement } from "../game/Achievement";
import { AchievementItem } from "./AchievementItem";

export class AchievementWindow extends Phaser.GameObjects.Container {

    private readonly items:
        AchievementItem[] = [];

    private readonly content:
        Phaser.GameObjects.Container;

    private scrollOffset = 0;

    constructor(
        scene: Phaser.Scene,
        width: number,
        height: number
    ) {

        super(
            scene,
            width / 2 - 180,
            height / 2 - 250
        );
        
        const overlay =
            scene.add.rectangle(
                -500,
                -500,
                3000,
                3000,
                0x000000,
                0.55
            )
            .setOrigin(
                0,
                0
            );

        this.add(
            overlay
        );  
        
        const background =
            scene.add.rectangle(
                0,
                0,
                360,
                500,
                0x111111
            )
            .setOrigin(
                0,
                0
            );

        background.setStrokeStyle(
            2,
            0x444444
        );

        const title =
            scene.add.text(
                20,
                15,
                "Achievements",
                {
                    fontSize: "24px",
                    color: "#ffffff"
                }
            );

        const closeButton =
            scene.add.text(
                330,
                20,
                "✕",
                {
                    fontSize: "28px",
                    color: "#ff6666"
                }
            )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            });

        closeButton.on(
            "pointerup",
            () => {

                this.hide();
            }
        );

        this.content =
            scene.add.container(
                0,
                0
            );

        this.add(
            background
        );

        this.add(
            title
        );

        this.add(
            closeButton
        );

        this.add(
            this.content
        );

        scene.input.on(

            "wheel",

            (
                pointer: Phaser.Input.Pointer,

                gameObjects: Phaser.GameObjects.GameObject[],

                deltaX: number,

                deltaY: number
            ) => {

                if (
                    !this.visible
                ) {
                    return;
                }

                this.scrollOffset +=
                    deltaY * 0.5;

                this.scrollOffset =
                    Math.max(
                        this.scrollOffset,
                        0
                    );

                this.updateScroll();
            }
        );

        this.setVisible(
            false
        );

        scene.add.existing(
            this
        );

        this.setDepth(
            10000
        );
    }

    setAchievements(
        achievements: Achievement[]
    ): void {

        this.items.forEach(
            item => item.destroy()
        );

        this.items.length = 0;

        this.content.removeAll(
            true
        );

        let y = 60;

        achievements.forEach(
            achievement => {

                const item =
                    new AchievementItem(    
                        this.scene,
                        15,
                        y,
                        achievement
                    );

                this.items.push(
                    item
                );

                this.content.add(
                    item
                );

                y += 110;
            }
        );

        this.updateScroll();
    }

    private updateScroll(): void {

        const contentHeight =
            this.items.length * 110;

        const visibleHeight =
            420;

        const maxScroll =
            Math.max(
                0,
                contentHeight -
                visibleHeight
            );

        this.scrollOffset =
            Phaser.Math.Clamp(
                this.scrollOffset,
                0,
                maxScroll
            );

        this.content.y =
            -this.scrollOffset;
    }

    show(): void {

    this.setVisible(
        true
    );
    }

    hide(): void {

        this.setVisible(
            false
        );
    }

    isVisible(): boolean {

        return this.visible;
    }

    toggle(): void {

        this.setVisible(
            !this.visible
        );
    }
}