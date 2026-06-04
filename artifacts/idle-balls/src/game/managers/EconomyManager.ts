export class EconomyManager {
    private money = 10;
    private incomeHistory: number[] = [];
    private lastHistoryTime = 0;
    private rateSmoothed = 0;
    private lastMoney = 10;

    setMoney(money: number): void { this.money = money; this.lastMoney = money; }
    addMoney(amount: number): void { this.money += amount; }

    spendMoney(amount: number): boolean {
        if (this.money < amount) return false;
        this.money -= amount;
        return true;
    }

    canAfford(amount: number): boolean { return this.money >= amount; }
    getMoney(): number { return this.money; }

    updateRate(now: number): void {
        if (now - this.lastHistoryTime > 500) {
            const delta = this.money - this.lastMoney;
            this.incomeHistory.push(delta);
            if (this.incomeHistory.length > 10) this.incomeHistory.shift();
            const sum = this.incomeHistory.reduce((a, b) => a + b, 0);
            this.rateSmoothed = (sum / this.incomeHistory.length) * 2;
            this.lastMoney = this.money;
            this.lastHistoryTime = now;
        }
    }

    getRate(): number { return this.rateSmoothed; }
}
