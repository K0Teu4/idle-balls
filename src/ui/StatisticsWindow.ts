import Phaser from "phaser";
import type { StatRow } from "../utils/StatisticsFormatter";

const PANEL_W = 560;

const PANEL_H = 580;

const CONTENT_X = 360;

const CONTENT_Y = 168;

const CONTENT_H = 470;

const ROW_H = 24;

const SECTION_GAP = 10;

export class StatisticsWindow {

    private readonly container: Phaser.GameObjects.Container;

    private readonly rowsContainer: Phaser.GameObjects.Container;

    private readonly rowTexts: Phaser.GameObjects.GameObject[] = [];

    private readonly activityBarBg: Phaser.GameObjects.Rectangle;

    private readonly activityBarFill: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene) {

        const cx = 640;
        const cy = 360;

        this.container = scene.add.container(0, 0);
        this.container.setDepth(10000).setVisible(false);

        const overlay = scene.add
            .rectangle(cx, cy, 3000, 3000, 0x000000, 0.65)
            .setInteractive();

        overlay.on("pointerup", () => this.hide());

        const background = scene.add
            .rectangle(cx, cy, PANEL_W, PANEL_H, 0x181818, 1)
            .setStrokeStyle(2, 0x555555);

        const title = scene.add
            .text(cx, cy - PANEL_H / 2 + 28, "STATISTICS", {
                fontSize: "28px",
                color: "#f5f5f5",
                fontStyle: "bold"
            })
            .setOrigin(0.5);

        const closeButton = scene.add
            .text(cx + PANEL_W / 2 - 28, cy - PANEL_H / 2 + 28, "✕", {
                fontSize: "28px",
                color: "#ff6666"
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        closeButton.on("pointerup", () => this.hide());

        const maskGfx = scene.add.graphics();
        maskGfx.fillStyle(0xffffff);
        maskGfx.fillRect(
            CONTENT_X,
            CONTENT_Y,
            PANEL_W - 80,
            CONTENT_H
        );

        const mask = maskGfx.createGeometryMask();
        maskGfx.setVisible(false);

        this.rowsContainer = scene.add.container(CONTENT_X, 0);
        this.rowsContainer.setMask(mask);

        this.activityBarBg = scene.add.rectangle(
            0,
            0,
            280,
            10,
            0x333333
        )
        .setOrigin(0, 0);

        this.activityBarFill = scene.add.rectangle(
            0,
            0,
            0,
            10,
            0x44cc88
        )
        .setOrigin(0, 0);

        this.container.add([
            overlay,
            background,
            title,
            closeButton,
            maskGfx,
            this.rowsContainer,
            this.activityBarBg,
            this.activityBarFill
        ]);
    }

    show(rows: StatRow[]): void {

        this.renderRows(rows);
        this.container.setVisible(true);
    }

    updateRows(rows: StatRow[]): void {

        if (!this.container.visible) {
            return;
        }

        this.renderRows(rows);
    }

    private renderRows(rows: StatRow[]): void {

        for (const obj of this.rowTexts) {
            obj.destroy();
        }

        this.rowTexts.length = 0;

        let y = CONTENT_Y;
        let activityBarY = 0;
        let activityPct = 0;

        const labelX = 16;
        const valueX = PANEL_W - 112;

        for (const row of rows) {

            if (row.section) {

                y += SECTION_GAP;

                const header = this.container.scene.add.text(
                    labelX,
                    y,
                    row.label,
                    {
                        fontSize: "14px",
                        color: "#7a7a7a",
                        fontStyle: "bold"
                    }
                );

                this.rowsContainer.add(header);
                this.rowTexts.push(header);
                y += 22;
                continue;
            }

            const label = this.container.scene.add.text(
                labelX,
                y,
                row.label,
                { fontSize: "16px", color: "#b8b8b8" }
            );

            const value = this.container.scene.add.text(
                valueX,
                y,
                row.value,
                {
                    fontSize: "16px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            );

            value.setOrigin(1, 0);

            this.rowsContainer.add(label);
            this.rowsContainer.add(value);
            this.rowTexts.push(label, value);

            if (row.label === "Activity") {
                activityBarY = y + ROW_H + 4;
                activityPct =
                    parseInt(row.value, 10) || 0;
                y += 18;
            }

            y += ROW_H;
        }

        this.activityBarBg.setPosition(
            CONTENT_X + labelX,
            activityBarY
        );

        this.activityBarFill.setPosition(
            CONTENT_X + labelX,
            activityBarY
        );

        this.activityBarFill.width =
            280 *
            Phaser.Math.Clamp(activityPct / 100, 0, 1);

        this.activityBarBg.setDepth(1);
        this.activityBarFill.setDepth(2);
    }

    hide(): void {

        this.container.setVisible(false);
    }

    toggle(rows: StatRow[]): void {

        if (this.container.visible) {
            this.hide();
            return;
        }

        this.show(rows);
    }
}
