import Phaser from "phaser";

import { ShopItem } from "./ShopItem";
import { UIColors } from "./UIColors";

export class ShopPanel {

    private autoDropperItem:
        ShopItem;

    private multiplierItem:
        ShopItem;

    private capacityItem:
        ShopItem;

    private goldenBallItem:
        ShopItem;

    constructor(

        scene: Phaser.Scene,

        onBuyAutoDropper:
            () => void,

        onBuyMultiplier:
            () => void,

        onBuyCapacity:
            () => void,

        onBuyGoldenBall:
            () => void
    ) {

        scene.add.text(
            980,
            30,
            "SHOP",
            {
                fontSize: "32px",
                color: UIColors.text
            }
        );

        this.autoDropperItem =
            new ShopItem(
                scene,
                950,
                80,
                "⚙ Auto Dropper",
                UIColors.autoDropper,
                onBuyAutoDropper
            );

        this.multiplierItem =
            new ShopItem(
                scene,
                950,
                230,
                "✦ Multiplier",
                UIColors.multiplier,
                onBuyMultiplier
            );

        this.capacityItem =
            new ShopItem(
                scene,
                950,
                380,
                "⬒ Ball Capacity",
                UIColors.capacity,
                onBuyCapacity
            );

        this.goldenBallItem =
            new ShopItem(
                scene,
                950,
                530,
                "★ Golden Balls",
                "#ffd700",
                onBuyGoldenBall
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
        capacityCost: number,

        goldenBallLevel: number,
        goldenBallChance: number,
        goldenBallCost: number
    ): void {

        this.autoDropperItem.setInfo([
            `Level: ${autoDropperLevel}`,
            `Cost: ${autoDropperCost}`,
            `Rate: ${autoDropperRate}/sec`
        ]);

        this.multiplierItem.setInfo([
            `Level: ${multiplierLevel}`,
            `Value: x${multiplierValue.toFixed(2)}`,
            `Cost: ${multiplierCost}`
        ]);

        this.capacityItem.setInfo([
            `Level: ${capacityLevel}`,
            `Capacity: ${capacityValue}`,
            `Cost: ${capacityCost}`
        ]);

        this.goldenBallItem.setInfo([
            `Level: ${goldenBallLevel}`,
            `Chance: ${goldenBallChance}%`,
            `Cost: ${goldenBallCost}`
        ]);
    }
}