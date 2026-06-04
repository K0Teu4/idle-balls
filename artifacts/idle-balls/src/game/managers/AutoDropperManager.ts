import { EconomyConfig } from "../config/EconomyConfig";

export class AutoDropperManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getCost(): number {
        return Math.floor(EconomyConfig.AUTO_DROPPER_BASE_COST * Math.pow(EconomyConfig.AUTO_DROPPER_COST_MULT, this.level));
    }

    getBallsPerSecond(): number { return this.level; }
    getIntervalMs(): number { return this.level > 0 ? 1000 / this.level : 0; }
}
