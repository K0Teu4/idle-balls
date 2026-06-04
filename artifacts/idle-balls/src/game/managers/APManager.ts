export class APManager {
    private totalAP = 0;
    private spentAP = 0;

    setData(total: number, spent: number): void {
        this.totalAP = total;
        this.spentAP = spent;
    }

    getTotal(): number { return this.totalAP; }
    getAvailable(): number { return this.totalAP - this.spentAP; }
    getSpent(): number { return this.spentAP; }

    addAP(n: number): void { this.totalAP += n; }

    spend(n: number): boolean {
        if (this.getAvailable() < n) return false;
        this.spentAP += n;
        return true;
    }
}
