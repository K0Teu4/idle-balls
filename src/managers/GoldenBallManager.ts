import { EconomyConfig } from "../config/EconomyConfig";

export class GoldenBallManager {

    private level = 0;

    getLevel(): number {

        return this.level;
    }

    setLevel(level: number): void {

        this.level = level;
    }

    buy(): void {

        this.level++;
    }

    getChance(): number {

        return Math.min(
            this.level,
            EconomyConfig.GOLDEN_BALL_MAX_CHANCE
        );
    }

    getRewardMultiplier(): number {

        return EconomyConfig.GOLDEN_BALL_REWARD_MULT;
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.GOLDEN_BALL_BASE_COST *
            Math.pow(
                EconomyConfig.GOLDEN_BALL_COST_MULT,
                this.level
            )
        );
    }
}
