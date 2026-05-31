export class StatisticsManager {

    private totalMoneyEarned = 0;

    private totalBallsDropped = 0;

    private totalGoldenBallsDropped = 0;

    private sessionStartTime =
        Date.now();

    addMoneyEarned(
        amount: number
    ): void {

        this.totalMoneyEarned +=
            amount;
    }

    addBallDropped(): void {

        this.totalBallsDropped++;
    }

    addGoldenBallDropped(): void {

        this.totalGoldenBallsDropped++;
    }

    getTotalMoneyEarned(): number {

        return this.totalMoneyEarned;
    }

    getTotalBallsDropped(): number {

        return this.totalBallsDropped;
    }

    getTotalGoldenBallsDropped(): number {

        return this.totalGoldenBallsDropped;
    }

    getSessionSeconds(): number {

        return Math.floor(
            (
                Date.now() -
                this.sessionStartTime
            ) / 1000
        );
    }

    setData(

        money: number,

        balls: number,

        goldenBalls: number
    ): void {

        this.totalMoneyEarned =
            money;

        this.totalBallsDropped =
            balls;

        this.totalGoldenBallsDropped =
            goldenBalls;
    }
}