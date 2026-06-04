export interface APUpgrade {
    id: string;
    title: string;
    description: string;
    effectLine: (level: number) => string;
    baseCost: number;
    costPerLevel: number;
}

export const AP_UPGRADES: APUpgrade[] = [
    {
        id: "income_boost",
        title: "Income Boost",
        description: "+4% slot income per level",
        effectLine: (l) => `+${(l * 4).toFixed(0)}% income now`,
        baseCost: 10,
        costPerLevel: 15,
    },
    {
        id: "ball_discount",
        title: "Ball Discount",
        description: "-4% ball cost; past lv10 → +3% income/lv",
        effectLine: (l) => l <= 10
            ? `Ball cost ×${(1 - l * 0.04).toFixed(2)}`
            : `Ball cost ×0.60, +${((l - 10) * 3).toFixed(0)}% income`,
        baseCost: 8,
        costPerLevel: 12,
    },
    {
        id: "golden_fortune",
        title: "Golden Fortune",
        description: "+0.4× golden reward; past lv12 → +2% all income/lv",
        effectLine: (l) => l <= 12
            ? `+${(l * 0.4).toFixed(1)}× golden reward`
            : `+${(l * 0.4).toFixed(1)}× golden, +${((l - 12) * 2).toFixed(0)}% income`,
        baseCost: 12,
        costPerLevel: 18,
    },
    {
        id: "combo_mastery",
        title: "Combo Mastery",
        description: "+120ms combo window & +1 max stack per 2 levels",
        effectLine: (l) => `Window +${l * 120}ms, stack +${Math.floor(l / 2)}`,
        baseCost: 10,
        costPerLevel: 20,
    },
    {
        id: "critical_hit",
        title: "Critical Strike",
        description: "+0.5% crit chance & +0.5× crit power per level",
        effectLine: (l) => `${(2 + l * 0.5).toFixed(1)}% chance, ×${(5 + l * 0.5).toFixed(1)} power`,
        baseCost: 15,
        costPerLevel: 25,
    },
    {
        id: "multi_ball",
        title: "Multi Ball",
        description: "+1.5% chance to spawn free bonus ball on slot hit",
        effectLine: (l) => `${(l * 1.5).toFixed(1)}% bonus ball chance`,
        baseCost: 20,
        costPerLevel: 30,
    },
];

export class APShopManager {
    private levels: Record<string, number> = {};

    constructor() {
        for (const u of AP_UPGRADES) this.levels[u.id] = 0;
    }

    setLevels(data: Record<string, number>): void {
        for (const key of Object.keys(data)) {
            if (key in this.levels) this.levels[key] = data[key];
        }
    }

    getLevels(): Record<string, number> { return { ...this.levels }; }
    getLevel(id: string): number { return this.levels[id] ?? 0; }

    getCost(id: string): number {
        const u = AP_UPGRADES.find(x => x.id === id)!;
        const l = this.getLevel(id);
        return u.baseCost + l * u.costPerLevel;
    }

    buy(id: string): void { this.levels[id] = (this.levels[id] ?? 0) + 1; }

    getIncomeBoostMult(): number {
        const ibLevel = this.getLevel("income_boost");
        const bdLevel = this.getLevel("ball_discount");
        const gfLevel = this.getLevel("golden_fortune");
        let boost = 1 + ibLevel * 0.04;
        if (bdLevel > 10) boost += (bdLevel - 10) * 0.03;
        if (gfLevel > 12) boost += (gfLevel - 12) * 0.02;
        return boost;
    }

    getBallCostMult(): number {
        const l = this.getLevel("ball_discount");
        return Math.max(0.01, 1 - Math.min(l, 10) * 0.04);
    }

    getGoldenRewardBonus(): number {
        const l = this.getLevel("golden_fortune");
        return 1 + l * 0.4;
    }

    getComboWindowBonus(): number {
        return this.getLevel("combo_mastery") * 120;
    }

    getComboStackBonus(): number {
        return Math.floor(this.getLevel("combo_mastery") / 2);
    }

    getCritChancePct(): number { return this.getLevel("critical_hit") * 0.5; }
    getCritPowerBonus(): number { return this.getLevel("critical_hit") * 0.5; }
    getMultiBallChancePct(): number { return this.getLevel("multi_ball") * 1.5; }
}
