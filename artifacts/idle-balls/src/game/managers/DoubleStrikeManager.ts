import { EconomyConfig } from "../config/EconomyConfig";

export class DoubleStrikeManager {
    private level = 0;

    setLevel(l: number): void { this.level = Math.max(0, l); }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getCost(): number {
        return Math.floor(EconomyConfig.DOUBLE_STRIKE_BASE_COST * Math.pow(EconomyConfig.DOUBLE_STRIKE_COST_MULT, this.level));
    }

    getChancePct(): number {
        return this.level * 4;
    }

    roll(): boolean {
        if (this.level === 0) return false;
        return Math.random() * 100 < this.getChancePct();
    }
}
