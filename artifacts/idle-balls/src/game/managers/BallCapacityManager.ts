import { EconomyConfig } from "../config/EconomyConfig";

export class BallCapacityManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getCapacity(): number { return 10 + this.level * 2; }

    getCost(): number {
        return Math.floor(EconomyConfig.BALL_CAPACITY_BASE_COST * Math.pow(EconomyConfig.BALL_CAPACITY_COST_MULT, this.level));
    }
}
