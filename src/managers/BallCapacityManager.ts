export class BallCapacityManager {

    private level = 0;

    setLevel(
        level: number
    ): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCapacity(): number {

        return (
            10 +
            this.level * 10
        );
    }

    getCost(): number {

        return Math.floor(
            100 *
            Math.pow(
                1.75,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }
}