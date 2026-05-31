import Phaser from "phaser";

import { ShopItem } from "./ShopItem";

export class ShopPanel {

    private autoDropperItem:
        ShopItem;

    private multiplierItem:
        ShopItem;

    private capacityItem:
        ShopItem;

    constructor(

        scene: Phaser.Scene,

        onBuyAutoDropper:
            () => void,

        onBuyMultiplier:
            () => void,

        onBuyCapacity:
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

        this.capacityItem =
            new ShopItem(
                scene,
                950,
                440,
                "Ball Capacity",
                onBuyCapacity
            );
    }

    update(

        autoDropperLevel: number,
        autoDropperCost: number,
        autoDropperRate: number,

        multiplierLevel: number,
        multiplierValue: number,
        multiplierCost: number,

        capacityLevel: number,
        capacityValue: number,
        capacityCost: number
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

        this.capacityItem.setInfo([
            `Level: ${capacityLevel}`,
            `Capacity: ${capacityValue}`,
            `Cost: ${capacityCost}`
        ]);
    }
}