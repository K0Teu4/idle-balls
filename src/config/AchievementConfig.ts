import type { Achievement } from "../game/Achievement";

export const ACHIEVEMENT_CONFIG: Achievement[] = [

    {
        id: "balls",
        title: "Ball Dropper",
        description: "Drop balls",
        level: 1,
        reward: 1,
        current: 0,
        target: 10
    },

    {
        id: "money",
        title: "Rich",
        description: "Earn total money",
        level: 1,
        reward: 2,
        current: 0,
        target: 500
    },

    {
        id: "golden",
        title: "Gold Hunter",
        description: "Drop golden balls",
        level: 1,
        reward: 3,
        current: 0,
        target: 5
    },

    {
        id: "shop",
        title: "Shopaholic",
        description: "Buy shop upgrades",
        level: 1,
        reward: 2,
        current: 0,
        target: 5
    },

    {
        id: "big_win",
        title: "Jackpot",
        description: "Best single slot hit",
        level: 1,
        reward: 5,
        current: 0,
        target: 25
    },

    {
        id: "auto",
        title: "Automation",
        description: "Auto-dropper level",
        level: 1,
        reward: 2,
        current: 0,
        target: 3
    },

    {
        id: "combo",
        title: "Combo Master",
        description: "Reach combo streak",
        level: 1,
        reward: 4,
        current: 0,
        target: 5
    },

    {
        id: "peg",
        title: "Lucky Striker",
        description: "Trigger peg bonuses",
        level: 1,
        reward: 2,
        current: 0,
        target: 20
    },

    {
        id: "slots",
        title: "Slot Veteran",
        description: "Land balls in slots",
        level: 1,
        reward: 2,
        current: 0,
        target: 50
    }
];
