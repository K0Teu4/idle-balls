import { EconomyConfig } from "../config/EconomyConfig";

export class BallCapacityManager {

    private level = 0;

    setLevel(level: number): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCapacity(): number {

        return (
            EconomyConfig.BALL_CAPACITY_BASE +
            this.level *
            EconomyConfig.BALL_CAPACITY_PER_LEVEL
        );
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.BALL_CAPACITY_BASE_COST *
            Math.pow(
                EconomyConfig.BALL_CAPACITY_COST_MULT,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }
}
