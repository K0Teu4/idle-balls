import Phaser from "phaser";
import { ShopItem } from "./ShopItem";
import { UIColors } from "./UIColors";
import { formatNumber } from "../utils/NumberFormatter";
import { SHOP_X, SHOP_WIDTH } from "../config/GameConfig";

export interface ShopPanelState {

    money: number;

    autoDropperLevel: number;
    autoDropperCost: number;
    autoDropperRate: number;

    multiplierLevel: number;
    multiplierValue: number;
    multiplierCost: number;

    capacityLevel: number;
    capacityValue: number;
    capacityCost: number;

    goldenBallLevel: number;
    goldenBallChance: number;
    goldenBallCost: number;

    luckyPegLevel: number;
    luckyPegLines: string[];
    luckyPegCost: number;

    speedBoostLevel: number;
    speedBoostLines: string[];
    speedBoostCost: number;
}

interface ShopEntry {

    item: ShopItem;

    getCost: (s: ShopPanelState) => number;
}

export class ShopPanel {

    private readonly root: Phaser.GameObjects.Container;

    private readonly entries: ShopEntry[] = [];

    private scrollOffset = 0;

    private maxScroll = 0;

    constructor(
        scene: Phaser.Scene,
        onBuyAutoDropper: () => void,
        onBuyMultiplier: () => void,
        onBuyCapacity: () => void,
        onBuyGoldenBall: () => void,
        onBuyLuckyPeg: () => void,
        onBuySpeedBoost: () => void
    ) {

        const panelBg = scene.add.rectangle(
            SHOP_X - 8,
            0,
            SHOP_WIDTH + 16,
            720,
            0x121212
        )
        .setOrigin(0, 0)
        .setDepth(-1);

        scene.add.text(
            SHOP_X + 12,
            14,
            "SHOP",
            { fontSize: "26px", color: UIColors.text }
        )
        .setDepth(0);

        const maskGfx = scene.make.graphics({});
        maskGfx.fillStyle(0xffffff);
        maskGfx.fillRect(
            SHOP_X,
            52,
            SHOP_WIDTH,
            658
        );

        const mask = maskGfx.createGeometryMask();

        this.root = scene.add.container(SHOP_X, 58);
        this.root.setMask(mask);

        const itemWidth = SHOP_WIDTH - 24;
        const itemHeight = 100;
        const gap = 8;
        let y = 0;

        const add = (
            title: string,
            color: string,
            buy: () => void,
            getCost: (s: ShopPanelState) => number
        ) => {

            const item = new ShopItem(
                scene,
                0,
                y,
                title,
                color,
                buy,
                itemHeight,
                itemWidth
            );

            this.entries.push({ item, getCost });
            this.root.add(item.getContainer());
            y += itemHeight + gap;
        };

        add("⚙ Auto Dropper", UIColors.autoDropper, onBuyAutoDropper, s => s.autoDropperCost);
        add("✦ Multiplier", UIColors.multiplier, onBuyMultiplier, s => s.multiplierCost);
        add("⬒ Capacity", UIColors.capacity, onBuyCapacity, s => s.capacityCost);
        add("★ Golden", "#ffd700", onBuyGoldenBall, s => s.goldenBallCost);
        add("☘ Lucky Peg", "#7dffb2", onBuyLuckyPeg, s => s.luckyPegCost);
        add("⚡ Speed", "#ffaa44", onBuySpeedBoost, s => s.speedBoostCost);

        this.maxScroll = Math.max(0, y - 640);

        scene.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                _o: Phaser.GameObjects.GameObject[],
                _dx: number,
                dy: number
            ) => {

                if (
                    pointer.x < SHOP_X ||
                    pointer.x > SHOP_X + SHOP_WIDTH
                ) {
                    return;
                }

                this.scrollOffset += dy * 0.5;
                this.applyScroll();
            }
        );

        panelBg.setScrollFactor(0);
    }

    update(state: ShopPanelState): void {

        const infos = [
            [
                `Lv ${state.autoDropperLevel} • ${state.autoDropperRate}/s`,
                `Cost ${formatNumber(state.autoDropperCost)}`
            ],
            [
                `Lv ${state.multiplierLevel} • ×${state.multiplierValue.toFixed(2)}`,
                `Cost ${formatNumber(state.multiplierCost)}`
            ],
            [
                `Lv ${state.capacityLevel} • ${state.capacityValue} max`,
                `Cost ${formatNumber(state.capacityCost)}`
            ],
            [
                `Lv ${state.goldenBallLevel} • ${state.goldenBallChance}%`,
                `Cost ${formatNumber(state.goldenBallCost)}`
            ],
            [
                ...state.luckyPegLines,
                `Cost ${formatNumber(state.luckyPegCost)}`
            ],
            [
                ...state.speedBoostLines,
                `Cost ${formatNumber(state.speedBoostCost)}`
            ]
        ];

        this.entries.forEach((entry, i) => {

            const cost = entry.getCost(state);

            entry.item.setInfo(infos[i] ?? []);
            entry.item.setAffordable(state.money >= cost);
        });
    }

    private applyScroll(): void {

        this.scrollOffset = Phaser.Math.Clamp(
            this.scrollOffset,
            0,
            this.maxScroll
        );

        this.root.y = 58 - this.scrollOffset;
    }
}
