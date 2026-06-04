export class ComboManager {
    private combo = 0;
    private lastHitTime = 0;
    private baseWindowMs = 800;
    private maxStack = 50;
    private windowBonus = 0;
    private stackBonus = 0;

    setAPUpgrades(windowMs: number, stack: number): void {
        this.windowBonus = windowMs;
        this.stackBonus = stack;
    }

    onSlotHit(now: number): { combo: number; multiplier: number } {
        const window = this.baseWindowMs + this.windowBonus;
        const max = this.maxStack + this.stackBonus;

        if (now - this.lastHitTime <= window) {
            this.combo = Math.min(this.combo + 1, max);
        } else {
            this.combo = 1;
        }
        this.lastHitTime = now;

        return { combo: this.combo, multiplier: this.getMultiplier() };
    }

    getMultiplier(): number {
        if (this.combo <= 1) return 1;
        const pct = (this.combo - 1) * 0.045;
        return 1 + pct;
    }

    getCombo(): number { return this.combo; }
    getBonusPct(): number { return Math.round((this.getMultiplier() - 1) * 100); }

    update(now: number): void {
        const window = this.baseWindowMs + this.windowBonus;
        if (this.combo > 0 && now - this.lastHitTime > window * 2) {
            this.combo = 0;
        }
    }
}
