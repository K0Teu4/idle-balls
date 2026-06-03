import Phaser from "phaser";
import type { Achievement } from "../game/Achievement";
import { AchievementItem } from "./AchievementItem";

const PANEL_W = 420;

const PANEL_H = 540;

const HEADER_H = 52;

const ITEM_HEIGHT = 100;

const LIST_H = PANEL_H - HEADER_H - 16;

export class AchievementWindow extends Phaser.GameObjects.Container {

    private readonly items = new Map<string, AchievementItem>();

    private readonly scrollContent: Phaser.GameObjects.Container;

    private readonly listMaskGraphics: Phaser.GameObjects.Graphics;

    private scrollOffset = 0;

    private built = false;

    constructor(
        scene: Phaser.Scene,
        width: number,
        height: number
    ) {

        super(scene, width / 2 - PANEL_W / 2, height / 2 - PANEL_H / 2);

        const overlay = scene.add
            .rectangle(-1200, -1200, 4000, 4000, 0x000000, 0.68)
            .setOrigin(0, 0)
            .setInteractive();

        overlay.on("pointerup", () => this.hide());
        this.add(overlay);

        const panel = scene.add
            .rectangle(0, 0, PANEL_W, PANEL_H, 0x181818, 1)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0x4a4a4a);

        this.add(panel);

        this.add(
            scene.add.text(20, 16, "ACHIEVEMENTS", {
                fontSize: "22px",
                color: "#f0f0f0",
                fontStyle: "bold"
            })
        );

        const closeButton = scene.add
            .text(PANEL_W - 22, 24, "✕", {
                fontSize: "26px",
                color: "#ff6666"
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        closeButton.on("pointerup", () => this.hide());
        this.add(closeButton);

        this.listMaskGraphics = scene.add.graphics();
        this.listMaskGraphics.fillStyle(0xffffff);
        this.listMaskGraphics.fillRect(
            12,
            HEADER_H,
            PANEL_W - 24,
            LIST_H
        );

        const mask = this.listMaskGraphics.createGeometryMask();
        this.listMaskGraphics.setVisible(false);

        this.scrollContent = scene.add.container(12, HEADER_H);
        this.scrollContent.setMask(mask);

        this.add(this.listMaskGraphics);
        this.add(this.scrollContent);

        const clipBottom = scene.add.rectangle(
            PANEL_W / 2,
            PANEL_H - 4,
            PANEL_W - 4,
            8,
            0x181818,
            1
        );

        this.add(clipBottom);

        scene.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                _o: Phaser.GameObjects.GameObject[],
                _dx: number,
                dy: number
            ) => {

                if (!this.visible) {
                    return;
                }

                const bounds = this.getBounds();

                if (!bounds.contains(pointer.x, pointer.y)) {
                    return;
                }

                this.scrollOffset += dy * 0.45;
                this.applyScroll();
            }
        );

        this.setVisible(false);
        this.setDepth(10000);
        scene.add.existing(this);
    }

    syncAchievements(
        achievements: Achievement[]
    ): void {

        if (!this.built) {
            this.buildItems(achievements);
            this.built = true;
            return;
        }

        for (const a of achievements) {
            this.items.get(a.id)?.updateData(a);
        }
    }

    private buildItems(
        achievements: Achievement[]
    ): void {

        let y = 6;

        for (const achievement of achievements) {

            const item = new AchievementItem(
                this.scene,
                4,
                y,
                achievement
            );

            this.items.set(achievement.id, item);
            this.scrollContent.add(item);
            y += ITEM_HEIGHT;
        }

        this.applyScroll();
    }

    private applyScroll(): void {

        const maxScroll = Math.max(
            0,
            this.items.size * ITEM_HEIGHT - LIST_H + 12
        );

        this.scrollOffset = Phaser.Math.Clamp(
            this.scrollOffset,
            0,
            maxScroll
        );

        this.scrollContent.y =
            HEADER_H - this.scrollOffset;
    }

    show(): void {

        this.setVisible(true);
        this.applyScroll();
    }

    hide(): void {

        this.setVisible(false);
    }

    toggle(): void {

        this.setVisible(!this.visible);
    }
}
