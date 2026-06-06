import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { ShopItem } from "./ShopItem";
import { t } from "../i18n/Strings";
import { fmt } from "../utils/NumberFormat";

export interface ShopUpdate {
    autoDropperLevel: number; autoDropperCost: number; autoDropperRate: number; autoDropperNextRate: number;
    multiplierLevel: number; multiplierVal: number; multiplierCost: number; multiplierNext: number;
    capacityLevel: number; capacityVal: number; capacityCost: number;
    goldenLevel: number; goldenChance: number; goldenCost: number;
    luckyPegLevel: number; luckyPegChance: number; luckyPegPower: number; luckyPegCost: number;
    speedLevel: number; speedInterval: number; speedAutoBoost: number; speedCost: number;
    dsLevel: number; dsChance: number; dsCost: number;
    insLevel: number; insRefund: number; insCost: number;
    bankLevel: number; bankInterest: number; bankCost: number;
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
    private bank: ShopItem;

    constructor(
        scene: Phaser.Scene,
        onAutoDropper: () => void,
        onMultiplier: () => void,
        onCapacity: () => void,
        onGolden: () => void,
        onLuckyPeg: () => void,
        onSpeed: () => void,
        onDoubleStrike: () => void,
        onInsurance: () => void,
        onBank: () => void
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
        const gap = 2;
        const H = ShopItem.H + gap;

        this.autoDropper  = new ShopItem(scene, ix, 36 + H * 0, t("item_auto"),    UIColors.autoDropper,   onAutoDropper,  depth);
        this.multiplier   = new ShopItem(scene, ix, 36 + H * 1, t("item_mult"),    UIColors.multiplier,    onMultiplier,   depth);
        this.capacity     = new ShopItem(scene, ix, 36 + H * 2, t("item_cap"),     UIColors.capacity,      onCapacity,     depth);
        this.golden       = new ShopItem(scene, ix, 36 + H * 3, t("item_golden"),  UIColors.golden,        onGolden,       depth);
        this.luckyPeg     = new ShopItem(scene, ix, 36 + H * 4, t("item_lucky"),   UIColors.luckyPeg,      onLuckyPeg,     depth);
        this.speed        = new ShopItem(scene, ix, 36 + H * 5, t("item_speed"),   UIColors.speed,         onSpeed,        depth);
        this.doubleStrike = new ShopItem(scene, ix, 36 + H * 6, t("item_dstrike"), UIColors.doubleStrike,  onDoubleStrike, depth);
        this.insurance    = new ShopItem(scene, ix, 36 + H * 7, t("item_insure"),  UIColors.insurance,     onInsurance,    depth);
        this.bank         = new ShopItem(scene, ix, 36 + H * 8, t("item_bank"),    UIColors.rate,          onBank,         depth);
    }

    update(u: ShopUpdate): void {
        const m = u.money;

        this.autoDropper.setInfo([
            `${u.autoDropperRate.toFixed(2)}/s  →  ${u.autoDropperNextRate.toFixed(2)}/s next`,
            `Cost: ${fmt(u.autoDropperCost)}`,
        ], m >= u.autoDropperCost, u.autoDropperLevel);

        this.multiplier.setInfo([
            `Slot ×${u.multiplierVal.toFixed(2)}  →  ×${u.multiplierNext.toFixed(2)} next`,
            `Cost: ${fmt(u.multiplierCost)}`,
        ], m >= u.multiplierCost, u.multiplierLevel);

        this.capacity.setInfo([
            `Max ${u.capacityVal} balls on board`,
            `Cost: ${fmt(u.capacityCost)}  |  +2 per level`,
        ], m >= u.capacityCost, u.capacityLevel);

        this.golden.setInfo([
            `${u.goldenChance.toFixed(1)}% golden chance  (5× reward)`,
            `Cost: ${fmt(u.goldenCost)}  |  +2% per level`,
        ], m >= u.goldenCost, u.goldenLevel);

        this.luckyPeg.setInfo([
            `${u.luckyPegChance.toFixed(1)}% peg bonus  ×${u.luckyPegPower.toFixed(2)}`,
            `Cost: ${fmt(u.luckyPegCost)}  |  +0.5% & +0.05× each`,
        ], m >= u.luckyPegCost, u.luckyPegLevel);

        this.speed.setInfo([
            `${u.speedInterval}ms manual cooldown`,
            `Auto +${u.speedAutoBoost}%  |  Cost: ${fmt(u.speedCost)}`,
        ], m >= u.speedCost, u.speedLevel);

        this.doubleStrike.setInfo([
            `${u.dsChance}% chance to ×2 slot income`,
            `Cost: ${fmt(u.dsCost)}  |  +4% per level`,
        ], m >= u.dsCost, u.dsLevel);

        this.insurance.setInfo([
            `${u.insRefund}% refund on ×1/×2 slots`,
            `Cost: ${fmt(u.insCost)}  |  +6% per level`,
        ], m >= u.insCost, u.insLevel);

        this.bank.setInfo([
            `${u.bankInterest.toFixed(1)}%/min passive interest`,
            `Cost: ${fmt(u.bankCost)}  |  +0.5%/min per level`,
        ], m >= u.bankCost, u.bankLevel);
    }
}
