export class AutoDropperManager {

    private level = 0;

    setLevel(
        level: number
    ): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCost(): number {

        return Math.floor(
            25 *
            Math.pow(
                2.5,
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