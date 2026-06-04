export interface AchievementMilestone {
    target: number;
    ap: number;
}

export interface AchievementDef {
    id: string;
    title: string;
    description: string;
    milestones: AchievementMilestone[];
}

export const ACHIEVEMENT_CONFIG: AchievementDef[] = [
    {
        id: "ball_dropper",
        title: "Ball Dropper",
        description: "Drop balls",
        milestones: [
            { target: 100, ap: 5 },
            { target: 1_000, ap: 15 },
            { target: 10_000, ap: 50 },
            { target: 100_000, ap: 200 },
            { target: 1_000_000, ap: 1000 },
        ]
    },
    {
        id: "rich",
        title: "Rich",
        description: "Earn total money",
        milestones: [
            { target: 1_000, ap: 10 },
            { target: 100_000, ap: 30 },
            { target: 10_000_000, ap: 100 },
            { target: 1_000_000_000, ap: 400 },
            { target: 1_000_000_000_000, ap: 2000 },
        ]
    },
    {
        id: "gold_hunter",
        title: "Gold Hunter",
        description: "Drop golden balls",
        milestones: [
            { target: 10, ap: 10 },
            { target: 100, ap: 30 },
            { target: 1_000, ap: 100 },
            { target: 10_000, ap: 500 },
            { target: 100_000, ap: 2500 },
        ]
    },
    {
        id: "shopaholic",
        title: "Shopaholic",
        description: "Buy shop upgrades",
        milestones: [
            { target: 10, ap: 6 },
            { target: 50, ap: 20 },
            { target: 250, ap: 75 },
            { target: 1_000, ap: 300 },
            { target: 5_000, ap: 1500 },
        ]
    },
    {
        id: "jackpot",
        title: "Jackpot",
        description: "Best single slot hit",
        milestones: [
            { target: 100, ap: 5 },
            { target: 10_000, ap: 20 },
            { target: 1_000_000, ap: 75 },
            { target: 1_000_000_000, ap: 300 },
            { target: 1_000_000_000_000, ap: 1500 },
        ]
    },
    {
        id: "automation",
        title: "Automation",
        description: "Auto-dropper level",
        milestones: [
            { target: 5, ap: 6 },
            { target: 20, ap: 20 },
            { target: 50, ap: 60 },
            { target: 100, ap: 200 },
            { target: 200, ap: 1000 },
        ]
    },
    {
        id: "combo_master",
        title: "Combo Master",
        description: "Reach combo streak",
        milestones: [
            { target: 5, ap: 5 },
            { target: 15, ap: 15 },
            { target: 30, ap: 50 },
            { target: 60, ap: 200 },
            { target: 120, ap: 1000 },
        ]
    },
    {
        id: "peg_buster",
        title: "Peg Buster",
        description: "Lucky peg hits",
        milestones: [
            { target: 50, ap: 5 },
            { target: 500, ap: 20 },
            { target: 5_000, ap: 75 },
            { target: 50_000, ap: 300 },
            { target: 500_000, ap: 1500 },
        ]
    },
    {
        id: "daily_devotion",
        title: "Daily Devotion",
        description: "Daily bonus streak",
        milestones: [
            { target: 3, ap: 10 },
            { target: 7, ap: 30 },
            { target: 14, ap: 80 },
            { target: 30, ap: 200 },
            { target: 100, ap: 1000 },
        ]
    },
];
