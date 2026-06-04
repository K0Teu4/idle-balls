export interface PrestigeUpgrade {
    id: string;
    title: string;
    description: string;
    effectLine: (level: number) => string;
    ppCost: (level: number) => number;
    maxLevel: number;
}

export const PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
    {
        id: "ancient_fortune",
        title: "Ancient Fortune",
        description: "+10% all income per level",
        effectLine: (l) => `+${l * 10}% all income`,
        ppCost: (l) => 1 + l * 2,
        maxLevel: 999,
    },
    {
        id: "head_start",
        title: "Head Start",
        description: "Start with bonus money after prestige",
        effectLine: (l) => l === 0 ? "No bonus yet" : `Start with ${_fmtSmall(Math.pow(10, l + 2))}`,
        ppCost: (l) => 2 + l * 3,
        maxLevel: 10,
    },
    {
        id: "resilience",
        title: "Resilience",
        description: "Keep 15% of each shop level per level",
        effectLine: (l) => `Keep ${l * 15}% of shop levels`,
        ppCost: (l) => 3 + l * 5,
        maxLevel: 5,
    },
    {
        id: "lucky_genes",
        title: "Lucky Genes",
        description: "+1% base golden ball chance per level",
        effectLine: (l) => `+${l}% golden chance (base)`,
        ppCost: (l) => 1 + l * 2,
        maxLevel: 20,
    },
    {
        id: "overclock",
        title: "Overclock",
        description: "+5% auto-drop rate per level",
        effectLine: (l) => `+${l * 5}% auto-drop rate`,
        ppCost: (l) => 2 + l * 3,
        maxLevel: 15,
    },
];

function _fmtSmall(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n.toFixed(0);
}

export class PrestigeManager {
    private count = 0;
    private totalPP = 0;
    private spentPP = 0;
    private levels: Record<string, number> = {};

    constructor() {
        for (const u of PRESTIGE_UPGRADES) this.levels[u.id] = 0;
    }

    setData(count: number, totalPP: number, spentPP: number, levels: Record<string, number>): void {
        this.count = count;
        this.totalPP = totalPP;
        this.spentPP = spentPP;
        for (const key of Object.keys(levels)) {
            if (key in this.levels) this.levels[key] = levels[key];
        }
    }

    getCount(): number { return this.count; }
    getTotalPP(): number { return this.totalPP; }
    getAvailablePP(): number { return this.totalPP - this.spentPP; }
    getSpentPP(): number { return this.spentPP; }
    getLevel(id: string): number { return this.levels[id] ?? 0; }
    getLevels(): Record<string, number> { return { ...this.levels }; }

    getRequirement(): number {
        return 1_000_000 * Math.pow(15, this.count);
    }

    canPrestige(money: number): boolean {
        return money >= this.getRequirement();
    }

    getPreviewPP(money: number): number {
        return Math.max(1, Math.floor(Math.sqrt(money / 1_000_000)));
    }

    doPrestige(money: number): number {
        const pp = this.getPreviewPP(money);
        this.totalPP += pp;
        this.count++;
        return pp;
    }

    getCost(id: string): number {
        const u = PRESTIGE_UPGRADES.find(x => x.id === id)!;
        const l = this.getLevel(id);
        return u.ppCost(l);
    }

    buyUpgrade(id: string): boolean {
        const cost = this.getCost(id);
        if (this.getAvailablePP() < cost) return false;
        const u = PRESTIGE_UPGRADES.find(x => x.id === id)!;
        if (this.levels[id] >= u.maxLevel) return false;
        this.spentPP += cost;
        this.levels[id]++;
        return true;
    }

    getGlobalIncomeMult(): number {
        return 1 + this.getLevel("ancient_fortune") * 0.10;
    }

    getStartingMoney(): number {
        const l = this.getLevel("head_start");
        return l === 0 ? 10 : Math.pow(10, l + 2);
    }

    getShopRetentionPct(): number {
        return this.getLevel("resilience") * 15;
    }

    getBaseGoldenChancePct(): number {
        return this.getLevel("lucky_genes");
    }

    getAutoDropBoostPct(): number {
        return this.getLevel("overclock") * 5;
    }
}
