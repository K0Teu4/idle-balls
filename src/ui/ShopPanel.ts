import Phaser from "phaser";

import { ShopItem } from "./ShopItem";

export class ShopPanel {

    private autoDropperItem:
        ShopItem;

    private multiplierItem:
        ShopItem;

    constructor(

        scene: Phaser.Scene,

        onBuyAutoDropper:
            () => void,

        onBuyMultiplier:
            () => void
    ) {

        scene.add.text(
            980,
            30,
            "SHOP",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        this.autoDropperItem =
            new ShopItem(
                scene,
                950,
                80,
                "Auto Dropper",
                onBuyAutoDropper
            );

        this.multiplierItem =
            new ShopItem(
                scene,
                950,
                260,
                "Multiplier",
                onBuyMultiplier
            );
    }

    update(

        autoDropperLevel: number,
        autoDropperCost: number,
        autoDropperRate: number,

        multiplierLevel: number,
        multiplierValue: number,
        multiplierCost: number
    ): void {

        this.autoDropperItem.setInfo([
            `Level: ${autoDropperLevel}`,
            `Cost: ${autoDropperCost}`,
            `Rate: ${autoDropperRate}/sec`
        ]);

        this.multiplierItem.setInfo([
            `Level: ${multiplierLevel}`,
            `Value: x${multiplierValue}`,
            `Cost: ${multiplierCost}`
        ]);
    }
}