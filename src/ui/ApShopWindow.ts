import Phaser from "phaser";
import { AP_SHOP_UPGRADES, type ApShopUpgradeId } from "../config/ApShopConfig";
import type { ApShopManager } from "../managers/ApShopManager";
import { formatNumber } from "../utils/NumberFormatter";
import { UIColors } from "./UIColors";

const PANEL_W = 420;

const PANEL_H = 620;

const CARD_H = 132;

export class ApShopWindow extends Phaser.GameObjects.Container {

    private readonly infoTexts =
        new Map<string, Phaser.GameObjects.Text>();

    private readonly buyButtons =
        new Map<string, Phaser.GameObjects.Rectangle>();

    private readonly scrollRoot: Phaser.GameObjects.Container;

    private pointsText!: Phaser.GameObjects.Text;

    private scrollOffset = 0;

    private maxScroll = 0;

    private onBuy?: (id: ApShopUpgradeId) => void;

    constructor(
        scene: Phaser.Scene,
        width: number,
        height: number
    ) {

        super(
            scene,
            width / 2 - PANEL_W / 2,
            height / 2 - PANEL_H / 2
        );

        const overlay = scene.add
            .rectangle(-1200, -1200, 4000, 4000, 0x000000, 0.68)
            .setOrigin(0, 0)
            .setInteractive();

        overlay.on("pointerup", () => this.hide());
        this.add(overlay);

        this.add(
            scene.add
                .rectangle(0, 0, PANEL_W, PANEL_H, 0x181818, 1)
                .setOrigin(0, 0)
                .setStrokeStyle(2, 0x4a4a4a)
        );

        this.add(
            scene.add.text(20, 14, "AP SHOP", {
                fontSize: "24px",
                color: "#d4af37",
                fontStyle: "bold"
            })
        );

        this.pointsText = scene.add.text(20, 44, "", {
            fontSize: "16px",
            color: "#cccccc"
        });

        this.add(this.pointsText);

        const closeButton = scene.add
            .text(PANEL_W - 22, 24, "✕", {
                fontSize: "26px",
                color: "#ff6666"
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        closeButton.on("pointerup", () => this.hide());
        this.add(closeButton);

        const maskGfx = scene.add.graphics();
        maskGfx.fillStyle(0xffffff);
        maskGfx.fillRect(12, 72, PANEL_W - 24, PANEL_H - 84);
        const mask = maskGfx.createGeometryMask();
        maskGfx.setVisible(false);

        this.scrollRoot = scene.add.container(12, 72);
        this.scrollRoot.setMask(mask);

        this.add(maskGfx);
        this.add(this.scrollRoot);

        let y = 0;

        for (const upgrade of AP_SHOP_UPGRADES) {

            this.scrollRoot.add(
                scene.add
                    .rectangle(4, y, PANEL_W - 40, CARD_H, 0x222222, 1)
                    .setOrigin(0, 0)
                    .setStrokeStyle(1, 0x3a3a3a)
            );

            this.scrollRoot.add(
                scene.add.text(16, y + 10, upgrade.title, {
                    fontSize: "17px",
                    color: "#ffffff",
                    fontStyle: "bold"
                })
            );

            this.scrollRoot.add(
                scene.add.text(16, y + 32, upgrade.description, {
                    fontSize: "12px",
                    color: "#999999",
                    wordWrap: { width: PANEL_W - 72 },
                    lineSpacing: 4
                })
            );

            const info = scene.add.text(16, y + 68, "", {
                fontSize: "14px",
                color: "#dddddd",
                lineSpacing: 3
            });

            this.infoTexts.set(upgrade.id, info);
            this.scrollRoot.add(info);

            const buyId = upgrade.id;

            const buttonBg = scene.add
                .rectangle(
                    PANEL_W - 130,
                    y + 88,
                    96,
                    28,
                    UIColors.button
                )
                .setOrigin(0, 0)
                .setInteractive({ useHandCursor: true });

            buttonBg.on("pointerup", () => this.onBuy?.(buyId));

            this.buyButtons.set(upgrade.id, buttonBg);
            this.scrollRoot.add(buttonBg);

            this.scrollRoot.add(
                scene.add
                    .text(
                        PANEL_W - 82,
                        y + 102,
                        "BUY",
                        { fontSize: "14px", color: "#ffffff" }
                    )
                    .setOrigin(0.5)
            );

            y += CARD_H + 10;
        }

        this.maxScroll = Math.max(0, y - (PANEL_H - 90));

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
        this.setDepth(10001);
        scene.add.existing(this);
    }

    private applyScroll(): void {

        this.scrollOffset = Phaser.Math.Clamp(
            this.scrollOffset,
            0,
            this.maxScroll
        );

        this.scrollRoot.y = 72 - this.scrollOffset;
    }

    setBuyHandler(handler: (id: ApShopUpgradeId) => void): void {

        this.onBuy = handler;
    }

    updateDisplay(
        apShop: ApShopManager,
        points: number
    ): void {

        this.pointsText.setText(
            `Your AP: ${formatNumber(points)}`
        );

        for (const upgrade of AP_SHOP_UPGRADES) {

            const info = this.infoTexts.get(upgrade.id);
            const btn = this.buyButtons.get(upgrade.id);

            if (!info || !btn) {
                continue;
            }

            const level = apShop.getLevel(upgrade.id);
            const cost = apShop.getCost(upgrade.id);
            const effect = apShop.getUpgradeDescription(upgrade.id);
            const canBuy = points >= cost;

            info.setText(
                [
                    `Level ${level}  •  ${formatNumber(cost)} AP`,
                    effect
                ].join("\n")
            );

            btn.fillColor = canBuy
                ? UIColors.button
                : UIColors.buttonDisabled;

            if (canBuy) {
                btn.setInteractive({ useHandCursor: true });
            }
            else {
                btn.disableInteractive();
            }
        }
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
