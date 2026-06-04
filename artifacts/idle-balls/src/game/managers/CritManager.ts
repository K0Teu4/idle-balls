export class CritManager {
    private apChanceBonus = 0;
    private apPowerBonus = 0;

    static readonly BASE_CHANCE_PCT = 2;
    static readonly BASE_POWER = 5;

    setAPUpgrades(chancePct: number, powerBonus: number): void {
        this.apChanceBonus = chancePct;
        this.apPowerBonus = powerBonus;
    }

    getChancePct(): number {
        return CritManager.BASE_CHANCE_PCT + this.apChanceBonus;
    }

    getPower(): number {
        return CritManager.BASE_POWER + this.apPowerBonus;
    }

    roll(): { isCrit: boolean; power: number } {
        const roll = Math.random() * 100;
        const isCrit = roll < this.getChancePct();
        return { isCrit, power: isCrit ? this.getPower() : 1 };
    }
}
