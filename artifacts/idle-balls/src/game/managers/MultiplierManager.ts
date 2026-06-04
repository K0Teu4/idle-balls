import { EconomyConfig } from "../config/EconomyConfig";

export class MultiplierManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getMultiplier(): number {
        return Math.pow(1.2, this.level);
    }

    getCost(): number {
        return Math.floor(EconomyConfig.MULTIPLIER_BASE_COST * Math.pow(EconomyConfig.MULTIPLIER_COST_MULT, this.level));
    }
}
