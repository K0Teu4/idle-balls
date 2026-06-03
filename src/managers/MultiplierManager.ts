import { EconomyConfig } from "../config/EconomyConfig";

export class MultiplierManager {

    private level = 0;

    setLevel(level: number): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getMultiplier(): number {

        const linear =
            0.5 * this.level;

        const logPart =
            0.8 * Math.log(1 + 0.35 * this.level);

        return Number(
            (1 + linear + logPart).toFixed(2)
        );
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.MULTIPLIER_BASE_COST *
            Math.pow(
                EconomyConfig.MULTIPLIER_COST_MULT,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }
}
