export class StatisticsManager {

    private totalMoneyEarned = 0;

    private totalBallsDropped = 0;

    private totalGoldenBallsDropped = 0;

    private totalPlayTimeSeconds = 0;

    private highestSingleReward = 0;

    private totalShopPurchases = 0;

    private totalSlotHits = 0;

    private totalPegBonuses = 0;

    private totalPegBonusMoney = 0;

    private sessionMoneyEarned = 0;

    private sessionStartTime = Date.now();

    private lastPlayTick = Date.now();

    addMoneyEarned(amount: number): void {

        this.totalMoneyEarned += amount;
        this.sessionMoneyEarned += amount;

        if (amount > this.highestSingleReward) {
            this.highestSingleReward = amount;
        }
    }

    addBallDropped(): void {

        this.totalBallsDropped++;
    }

    addGoldenBallDropped(): void {

        this.totalGoldenBallsDropped++;
    }

    addShopPurchase(): void {

        this.totalShopPurchases++;
    }

    addSlotHit(): void {

        this.totalSlotHits++;
    }

    addPegBonus(amount: number): void {

        this.totalPegBonuses++;
        this.totalPegBonusMoney += amount;
        this.addMoneyEarned(amount);
    }

    tickPlayTime(): void {

        const now = Date.now();
        const delta = Math.floor((now - this.lastPlayTick) / 1000);

        if (delta > 0) {
            this.totalPlayTimeSeconds += delta;
            this.lastPlayTick = now;
        }
    }

    addPlayTime(seconds: number): void {

        if (seconds > 0) {
            this.totalPlayTimeSeconds += seconds;
            this.lastPlayTick = Date.now();
        }
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

    getTotalPlayTimeSeconds(): number {

        return this.totalPlayTimeSeconds;
    }

    getHighestSingleReward(): number {

        return this.highestSingleReward;
    }

    getTotalShopPurchases(): number {

        return this.totalShopPurchases;
    }

    getTotalSlotHits(): number {

        return this.totalSlotHits;
    }

    getTotalPegBonuses(): number {

        return this.totalPegBonuses;
    }

    getTotalPegBonusMoney(): number {

        return this.totalPegBonusMoney;
    }

    getSessionMoneyEarned(): number {

        return this.sessionMoneyEarned;
    }

    getSessionSeconds(): number {

        return Math.floor(
            (Date.now() - this.sessionStartTime) / 1000
        );
    }

    setData(
        money: number,
        balls: number,
        goldenBalls: number,
        playTimeSeconds: number,
        highestReward: number,
        shopPurchases: number,
        slotHits: number,
        pegBonuses: number,
        pegBonusMoney: number
    ): void {

        this.totalMoneyEarned = money;
        this.totalBallsDropped = balls;
        this.totalGoldenBallsDropped = goldenBalls;
        this.totalPlayTimeSeconds = playTimeSeconds;
        this.highestSingleReward = highestReward;
        this.totalShopPurchases = shopPurchases;
        this.totalSlotHits = slotHits;
        this.totalPegBonuses = pegBonuses;
        this.totalPegBonusMoney = pegBonusMoney;
        this.lastPlayTick = Date.now();
    }
}
