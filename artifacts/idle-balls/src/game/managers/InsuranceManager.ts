import { EconomyConfig } from "../config/EconomyConfig";

export class InsuranceManager {
    private level = 0;

    setLevel(l: number): void { this.level = Math.max(0, l); }
    getLevel(): number { return this.level; }
    buy(): void { this.level++; }

    getCost(): number {
        return Math.floor(EconomyConfig.INSURANCE_BASE_COST * Math.pow(EconomyConfig.INSURANCE_COST_MULT, this.level));
    }

    getRefundPct(): number {
        return Math.min(this.level * 6, 60);
    }

    getRefundAmount(ballCost: number): number {
        if (this.level === 0) return 0;
        return Math.floor(ballCost * this.getRefundPct() / 100);
    }
}
