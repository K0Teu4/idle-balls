import { EconomyConfig } from "../config/EconomyConfig";

export class SpeedManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getDropIntervalMs(): number {
        return Math.max(50, 250 - this.level * 10);
    }

    getAutoBoostPct(): number {
        return this.level * 3;
    }

    getCost(): number {
        return Math.floor(EconomyConfig.SPEED_BASE_COST * Math.pow(EconomyConfig.SPEED_COST_MULT, this.level));
    }
}
