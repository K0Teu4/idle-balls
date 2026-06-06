import { EconomyConfig } from "../config/EconomyConfig";

export class BankManager {
    private level = 0;
    private accum = 0;

    getLevel(): number { return this.level; }
    setLevel(l: number): void { this.level = Math.max(0, l); this.accum = 0; }
    buy(): void { this.level++; }

    getCost(): number {
        return Math.floor(EconomyConfig.BANK_BASE_COST * Math.pow(EconomyConfig.BANK_COST_MULT, this.level));
    }

    getInterestPct(): number { return this.level * 0.5; }

    tick(money: number, deltaSec: number): number {
        if (this.level === 0) return 0;
        const ratePerSec = (this.getInterestPct() / 100) / 60;
        this.accum += money * ratePerSec * deltaSec;
        const earned = Math.floor(this.accum);
        this.accum -= earned;
        return earned;
    }
}
