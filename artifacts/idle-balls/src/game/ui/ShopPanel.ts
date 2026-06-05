import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { ShopItem } from "./ShopItem";
import { t } from "../i18n/Strings";
import { fmt } from "../utils/NumberFormat";

export interface ShopUpdate {
    autoDropperLevel: number; autoDropperCost: number; autoDropperRate: number;
    multiplierLevel: number; multiplierVal: number; multiplierCost: number;
    capacityLevel: number; capacityVal: number; capacityCost: number;
    goldenLevel: number; goldenChance: number; goldenCost: number;
    luckyPegLevel: number; luckyPegChance: number; luckyPegPower: number; luckyPegCost: number;
    speedLevel: number; speedInterval: number; speedAutoBoost: number; speedCost: number;
    dsLevel: number; dsChance: number; dsCost: number;
    insLevel: number; insRefund: number; insCost: number;
    money: number;
}

export class ShopPanel {
    private autoDropper: ShopItem;
    private multiplier: ShopItem;
    private capacity: ShopItem;
    private golden: ShopItem;
    private luckyPeg: ShopItem;
    private speed: ShopItem;
    private doubleStrike: ShopItem;
    private insurance: ShopItem;

    constructor(
        scene: Phaser.Scene,
        onAutoDropper: () => void,
        onMultiplier: () => void,
        onCapacity: () => void,
        onGolden: () => void,
        onLuckyPeg: () => void,
        onSpeed: () => void,
        onDoubleStrike: () => void,
        onInsurance: () => void
    ) {
        const depth = 20;
        const rx = 938;
        const rw = ShopItem.W + 22;

        scene.add.rectangle(rx + rw / 2 + 2, 360, rw + 4, 724, UIColors.panel)
            .setDepth(depth - 1)
            .setStrokeStyle(1, UIColors.panelBorder);

        scene.add.text(rx + 10, 8, t("shop_title"), {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: UIColors.text,
            fontStyle: "bold",
        }).setDepth(depth);

        const ix = rx + 8;
        const gap = 3;
        const H = ShopItem.H + gap;

        this.autoDropper  = new ShopItem(scene, ix, 36 + H * 0, t("item_auto"),    UIColors.autoDropper,   onAutoDropper,  depth);
        this.multiplier   = new ShopItem(scene, ix, 36 + H * 1, t("item_mult"),    UIColors.multiplier,    onMultiplier,   depth);
        this.capacity     = new ShopItem(scene, ix, 36 + H * 2, t("item_cap"),     UIColors.capacity,      onCapacity,     depth);
        this.golden       = new ShopItem(scene, ix, 36 + H * 3, t("item_golden"),  UIColors.golden,        onGolden,       depth);
        this.luckyPeg     = new ShopItem(scene, ix, 36 + H * 4, t("item_lucky"),   UIColors.luckyPeg,      onLuckyPeg,     depth);
        this.speed        = new ShopItem(scene, ix, 36 + H * 5, t("item_speed"),   UIColors.speed,         onSpeed,        depth);
        this.doubleStrike = new ShopItem(scene, ix, 36 + H * 6, t("item_dstrike"), UIColors.doubleStrike,  onDoubleStrike, depth);
        this.insurance    = new ShopItem(scene, ix, 36 + H * 7, t("item_insure"),  UIColors.insurance,     onInsurance,    depth);
    }

    update(u: ShopUpdate): void {
        const m = u.money;

        this.autoDropper.setInfo([
            `${u.autoDropperRate.toFixed(1)}/s auto-drop rate`,
            `Cost: ${fmt(u.autoDropperCost)}`,
        ], m >= u.autoDropperCost, u.autoDropperLevel);

        this.multiplier.setInfo([
            `×${u.multiplierVal.toFixed(2)} slot multiplier`,
            `Cost: ${fmt(u.multiplierCost)}`,
        ], m >= u.multiplierCost, u.multiplierLevel);

        this.capacity.setInfo([
            `${u.capacityVal} balls max on board`,
            `Cost: ${fmt(u.capacityCost)}`,
        ], m >= u.capacityCost, u.capacityLevel);

        this.golden.setInfo([
            `${u.goldenChance.toFixed(1)}% golden ball chance  (5× reward)`,
            `Cost: ${fmt(u.goldenCost)}`,
        ], m >= u.goldenCost, u.goldenLevel);

        this.luckyPeg.setInfo([
            `${u.luckyPegChance.toFixed(1)}% peg hit bonus chance`,
            `Bonus ×${u.luckyPegPower.toFixed(2)}  Cost: ${fmt(u.luckyPegCost)}`,
        ], m >= u.luckyPegCost, u.luckyPegLevel);

        this.speed.setInfo([
            `${u.speedInterval}ms manual drop interval`,
            `Auto +${u.speedAutoBoost}%  Cost: ${fmt(u.speedCost)}`,
        ], m >= u.speedCost, u.speedLevel);

        this.doubleStrike.setInfo([
            `${u.dsChance}% chance to double slot income`,
            `Cost: ${fmt(u.dsCost)}`,
        ], m >= u.dsCost, u.dsLevel);

        this.insurance.setInfo([
            `${u.insRefund}% refund on ×1 / ×2 slot hits`,
            `Cost: ${fmt(u.insCost)}`,
        ], m >= u.insCost, u.insLevel);
    }
}
