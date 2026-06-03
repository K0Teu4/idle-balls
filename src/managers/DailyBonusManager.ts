import { EconomyConfig } from "../config/EconomyConfig";

export class DailyBonusManager {

    private lastClaimDay = "";

    private streak = 0;

    getStreak(): number {

        return this.streak;
    }

    setState(
        lastClaimDay: string,
        streak: number
    ): void {

        this.lastClaimDay = lastClaimDay;
        this.streak = streak;
        this.refreshStreakIfBroken();
    }

    canClaim(): boolean {

        return (
            this.lastClaimDay !==
            this.getTodayKey()
        );
    }

    claim(
        totalMoneyEarned: number
    ): number {

        if (!this.canClaim()) {
            return 0;
        }

        const today =
            this.getTodayKey();

        if (
            this.lastClaimDay ===
            this.getYesterdayKey()
        ) {

            this.streak++;
        }
        else {

            this.streak = 1;
        }

        this.lastClaimDay = today;

        const scaled =
            Math.floor(
                EconomyConfig.DAILY_BONUS_BASE +
                Math.sqrt(totalMoneyEarned) *
                EconomyConfig.DAILY_BONUS_SCALE
            );

        const streakMult =
            1 +
            Math.min(
                this.streak - 1,
                EconomyConfig.DAILY_STREAK_CAP
            ) *
            EconomyConfig.DAILY_STREAK_BONUS;

        return Math.floor(
            scaled * streakMult
        );
    }

    getLastClaimDay(): string {

        return this.lastClaimDay;
    }

    private refreshStreakIfBroken(): void {

        if (
            this.lastClaimDay === "" ||
            this.lastClaimDay === this.getTodayKey()
        ) {
            return;
        }

        if (
            this.lastClaimDay !==
            this.getYesterdayKey()
        ) {

            this.streak = 0;
        }
    }

    private getTodayKey(): string {

        return this.formatDayKey(new Date());
    }

    private getYesterdayKey(): string {

        const date = new Date();
        date.setDate(date.getDate() - 1);
        return this.formatDayKey(date);
    }

    private formatDayKey(
        date: Date
    ): string {

        return date.toISOString().slice(0, 10);
    }
}
