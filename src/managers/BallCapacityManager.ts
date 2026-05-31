export class BallCapacityManager {

    private level = 0;

    private readonly BASE_CAPACITY = 100;

    private readonly CAPACITY_PER_LEVEL = 10;

    getLevel(): number {

        return this.level;
    }

    setLevel(
        level: number
    ): void {

        this.level = level;
    }

    buy(): void {

        this.level++;
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

    getCapacity(): number {

        return (
            this.BASE_CAPACITY +
            this.level *
            this.CAPACITY_PER_LEVEL
        );
    }
}