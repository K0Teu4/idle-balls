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
            this.level * 2
        );
    }

    getCost(): number {

        return Math.floor(
            50 *
            Math.pow(
                1.6,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }
}