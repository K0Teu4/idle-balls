export class GoldenBallManager {

    private level = 0;

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

    getChance(): number {

        return this.level;
    }

    getRewardMultiplier(): number {

        return 5;
    }

    getCost(): number {

        return Math.floor(
            250 *
            Math.pow(
                1.55,
                this.level
            )
        );
    }
}