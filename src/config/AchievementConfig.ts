import type { Achievement } from "../game/Achievement";

export const ACHIEVEMENT_CONFIG:
    Achievement[] = [

    {
        id: "balls",

        title: "Ball Dropper",

        description: "Drop balls",

        level: 1,

        reward: 1,

        current: 0,

        target: 1
    },

    {
        id: "money",
        
        title: "Rich",

        description: "Earn money",

        level: 1,

        reward: 1,

        current: 0,

        target: 1000
    },

    {
        id: "golden",
        
        title: "Gold Hunter",

        description: "Drop golden balls",

        level: 1,

        reward: 2,

        current: 0,

        target: 10
    }

];