export class DailyBonusManager {
    private lastDate: string | null = null;
    private streak = 0;
    private claimedToday = false;

    setData(lastDate: string | null, streak: number): void {
        this.lastDate = lastDate;
        this.streak = streak;
        const today = this.getToday();
        this.claimedToday = (lastDate === today);
    }

    private getToday(): string {
        return new Date().toISOString().split("T")[0];
    }

    canClaim(): boolean {
        return !this.claimedToday;
    }

    claim(): { amount: number; streak: number } {
        const today = this.getToday();
        const yesterday = this.getYesterday();

        if (this.lastDate === yesterday) {
            this.streak++;
        } else if (this.lastDate !== today) {
            this.streak = 1;
        }

        this.lastDate = today;
        this.claimedToday = true;

        const multiplier = Math.min(this.streak, 7);
        const baseAmount = 500 * Math.pow(3, Math.min(this.streak - 1, 6));
        return { amount: Math.floor(baseAmount * multiplier / 7 + baseAmount), streak: this.streak };
    }

    private getYesterday(): string {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
    }

    getStreak(): number { return this.streak; }
    getLastDate(): string | null { return this.lastDate; }
    isClaimedToday(): boolean { return this.claimedToday; }

    getBonusPreview(baseIncomeRate: number): number {
        const streakMult = Math.min(1 + (this.streak) * 0.5, 4);
        return Math.max(500, Math.floor(baseIncomeRate * 60 * streakMult));
    }
}
