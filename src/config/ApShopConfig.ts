export type ApShopUpgradeId =
    | "income"
    | "discount"
    | "golden"
    | "combo";

export interface ApShopUpgradeDef {

    id: ApShopUpgradeId;

    title: string;

    description: string;

    /** Hard cap; use 0 for unlimited. */
    maxLevel: number;
}

export const AP_SHOP_UPGRADES: ApShopUpgradeDef[] = [

    {
        id: "income",
        title: "Income Boost",
        description: "+4% slot income per level",
        maxLevel: 0
    },

    {
        id: "discount",
        title: "Ball Discount",
        description: "-4% ball cost; past lv10 → +3% income/lv",
        maxLevel: 0
    },

    {
        id: "golden",
        title: "Golden Fortune",
        description: "+0.4× golden reward; past lv12 → +2% all income/lv",
        maxLevel: 0
    },

    {
        id: "combo",
        title: "Combo Mastery",
        description: "+120ms combo window & +1 max stack / 2 lv",
        maxLevel: 0
    }
];

export function getApUpgradeCost(
    level: number
): number {

    return Math.floor(
        8 +
        6 * Math.pow(1.38, level)
    );
}
