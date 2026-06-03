import { EconomyConfig } from "../config/EconomyConfig";

export class AutoDropperManager {

    private level = 0;

    setLevel(level: number): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.AUTO_DROPPER_BASE_COST *
            Math.pow(
                EconomyConfig.AUTO_DROPPER_COST_MULT,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }

    getBallsPerSecond(): number {

        return this.level;
    }
}
