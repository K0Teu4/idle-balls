import { EconomyConfig } from "../config/EconomyConfig";

export class GoldenBallManager {
    private level = 0;

    setLevel(l: number): void { this.level = l; }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getChancePct(): number { return Math.min(this.level, 95); }
    getRewardMultiplier(): number { return 5; }

    getCost(): number {
        return Math.floor(EconomyConfig.GOLDEN_BALL_BASE_COST * Math.pow(EconomyConfig.GOLDEN_BALL_COST_MULT, this.level));
    }
}
