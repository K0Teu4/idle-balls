export class MultiplierManager {

    private level = 0;

    setLevel(
        level: number
    ): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getMultiplier(): number {

        return Number(
            Math.pow(
                1.1,
                this.level
            ).toFixed(2)
        );
    }

    getCost(): number {

        return Math.floor(
            50 *
            Math.pow(
                2,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }
}