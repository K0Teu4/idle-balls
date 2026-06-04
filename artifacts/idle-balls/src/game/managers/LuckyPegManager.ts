import { EconomyConfig } from "../config/EconomyConfig";

export class LuckyPegManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getChancePct(): number { return Math.min(this.level * 0.9, 90); }
    getPower(): number { return 1 + this.level * 0.075; }

    getCost(): number {
        return Math.floor(EconomyConfig.LUCKY_PEG_BASE_COST * Math.pow(EconomyConfig.LUCKY_PEG_COST_MULT, this.level));
    }
}
