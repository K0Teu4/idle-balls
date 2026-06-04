import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { ShopItem } from "./ShopItem";
import { fmt } from "../utils/NumberFormat";

interface ShopUpdate {
    autoDropperLevel: number; autoDropperCost: number; autoDropperRate: number;
    multiplierLevel: number; multiplierVal: number; multiplierCost: number;
    capacityLevel: number; capacityVal: number; capacityCost: number;
    goldenLevel: number; goldenChance: number; goldenCost: number;
    luckyPegLevel: number; luckyPegChance: number; luckyPegPower: number; luckyPegCost: number;
    speedLevel: number; speedInterval: number; speedAutoBoost: number; speedCost: number;
    money: number;
}

export class ShopPanel {
    private autoDropper: ShopItem;
    private multiplier: ShopItem;
    private capacity: ShopItem;
    private golden: ShopItem;
    private luckyPeg: ShopItem;
    private speed: ShopItem;

    constructor(
        scene: Phaser.Scene,
        onAutoDropper: () => void,
        onMultiplier: () => void,
        onCapacity: () => void,
        onGolden: () => void,
        onLuckyPeg: () => void,
        onSpeed: () => void
    ) {
        const depth = 20;
        const rx = 938;
        const rw = ShopItem.W + 22;

        scene.add.rectangle(rx + rw / 2 + 2, 360, rw + 4, 724, UIColors.panel)
            .setDepth(depth - 1)
            .setStrokeStyle(1, UIColors.panelBorder);

        scene.add.text(rx + 10, 10, "SHOP", {
            fontFamily: "'Courier New', monospace",
            fontSize: "22px",
            color: UIColors.text,
            fontStyle: "bold",
        }).setDepth(depth);

        const ix = rx + 8;
        const gap = 4;
        const H = ShopItem.H + gap;

        this.autoDropper = new ShopItem(scene, ix, 40, "⚙ Auto Dropper", UIColors.autoDropper, onAutoDropper, depth);
        this.multiplier = new ShopItem(scene, ix, 40 + H, "✦ Multiplier", UIColors.multiplier, onMultiplier, depth);
        this.capacity = new ShopItem(scene, ix, 40 + H * 2, "⬒ Capacity", UIColors.capacity, onCapacity, depth);
        this.golden = new ShopItem(scene, ix, 40 + H * 3, "★ Golden", UIColors.golden, onGolden, depth);
        this.luckyPeg = new ShopItem(scene, ix, 40 + H * 4, "☘ Lucky Peg", UIColors.luckyPeg, onLuckyPeg, depth);
        this.speed = new ShopItem(scene, ix, 40 + H * 5, "⚡ Speed", UIColors.speed, onSpeed, depth);
    }

    update(u: ShopUpdate): void {
        const m = u.money;

        this.autoDropper.setInfo([
            `Lv ${u.autoDropperLevel}  •  ${u.autoDropperRate.toFixed(1)}/s`,
            `Cost: ${fmt(u.autoDropperCost)}`,
        ], m >= u.autoDropperCost);

        this.multiplier.setInfo([
            `Lv ${u.multiplierLevel}  •  ×${u.multiplierVal.toFixed(2)}`,
            `Cost: ${fmt(u.multiplierCost)}`,
        ], m >= u.multiplierCost);

        this.capacity.setInfo([
            `Lv ${u.capacityLevel}  •  ${u.capacityVal} max`,
            `Cost: ${fmt(u.capacityCost)}`,
        ], m >= u.capacityCost);

        this.golden.setInfo([
            `Lv ${u.goldenLevel}  •  ${u.goldenChance}% chance`,
            `Cost: ${fmt(u.goldenCost)}`,
        ], m >= u.goldenCost);

        this.luckyPeg.setInfo([
            `Lv ${u.luckyPegLevel}  •  ${u.luckyPegChance.toFixed(1)}% hit`,
            `Peg power ×${u.luckyPegPower.toFixed(2)}`,
            `Cost: ${fmt(u.luckyPegCost)}`,
        ], m >= u.luckyPegCost);

        this.speed.setInfo([
            `Lv ${u.speedLevel}  •  ${u.speedInterval}ms drop`,
            `Auto +${u.speedAutoBoost}%`,
            `Cost: ${fmt(u.speedCost)}`,
        ], m >= u.speedCost);
    }
}
