export class StatisticsManager {
    private totalMoneyEarned = 0;
    private totalBallsDropped = 0;
    private totalGoldenBallsDropped = 0;
    private totalSlotHits = 0;
    private totalPegBonuses = 0;
    private totalShopPurchases = 0;
    private bestSingleHit = 0;
    private bestCombo = 0;
    private totalPlayTimeSec = 0;
    private sessionStart = Date.now();

    setData(d: Partial<{
        totalMoneyEarned: number;
        totalBallsDropped: number;
        totalGoldenBallsDropped: number;
        totalSlotHits: number;
        totalPegBonuses: number;
        totalShopPurchases: number;
        bestSingleHit: number;
        bestCombo: number;
        totalPlayTimeSec: number;
    }>): void {
        if (d.totalMoneyEarned != null) this.totalMoneyEarned = d.totalMoneyEarned;
        if (d.totalBallsDropped != null) this.totalBallsDropped = d.totalBallsDropped;
        if (d.totalGoldenBallsDropped != null) this.totalGoldenBallsDropped = d.totalGoldenBallsDropped;
        if (d.totalSlotHits != null) this.totalSlotHits = d.totalSlotHits;
        if (d.totalPegBonuses != null) this.totalPegBonuses = d.totalPegBonuses;
        if (d.totalShopPurchases != null) this.totalShopPurchases = d.totalShopPurchases;
        if (d.bestSingleHit != null) this.bestSingleHit = d.bestSingleHit;
        if (d.bestCombo != null) this.bestCombo = d.bestCombo;
        if (d.totalPlayTimeSec != null) this.totalPlayTimeSec = d.totalPlayTimeSec;
    }

    addMoney(n: number): void { this.totalMoneyEarned += n; }
    addBall(): void { this.totalBallsDropped++; }
    addGoldenBall(): void { this.totalGoldenBallsDropped++; }
    addSlotHit(): void { this.totalSlotHits++; }
    addPegBonus(n: number): void { this.totalPegBonuses += n; }
    addPurchase(): void { this.totalShopPurchases++; }
    trackHit(n: number): void { if (n > this.bestSingleHit) this.bestSingleHit = n; }
    trackCombo(n: number): void { if (n > this.bestCombo) this.bestCombo = n; }

    getSessionSec(): number { return Math.floor((Date.now() - this.sessionStart) / 1000); }
    getTotalPlaySec(): number { return this.totalPlayTimeSec + this.getSessionSec(); }

    getAll() {
        return {
            totalMoneyEarned: this.totalMoneyEarned,
            totalBallsDropped: this.totalBallsDropped,
            totalGoldenBallsDropped: this.totalGoldenBallsDropped,
            totalSlotHits: this.totalSlotHits,
            totalPegBonuses: this.totalPegBonuses,
            totalShopPurchases: this.totalShopPurchases,
            bestSingleHit: this.bestSingleHit,
            bestCombo: this.bestCombo,
        };
    }
}
