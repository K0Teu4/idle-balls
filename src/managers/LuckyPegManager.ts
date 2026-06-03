import { EconomyConfig } from "../config/EconomyConfig";

export class LuckyPegManager {

    private level = 0;

    setLevel(level: number): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.LUCKY_PEG_BASE_COST *
            Math.pow(
                EconomyConfig.LUCKY_PEG_COST_MULT,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }

    getChance(): number {

        return Math.min(
            this.level *
            EconomyConfig.LUCKY_PEG_CHANCE_PER_LEVEL,
            EconomyConfig.LUCKY_PEG_MAX_CHANCE
        );
    }

    /** Levels beyond chance cap increase peg payout. */
    getBonusMultiplier(): number {

        const over = Math.max(
            0,
            this.level -
            EconomyConfig.LUCKY_PEG_MAX_LEVEL_FOR_CHANCE
        );

        return (
            1 +
            over *
            EconomyConfig.LUCKY_PEG_OVERLEVEL_BONUS_MULT
        );
    }

    getInfoLines(): string[] {

        const chance = this.getChance();
        const mult = this.getBonusMultiplier();

        if (mult > 1) {
            return [
                `Lv ${this.level} • ${chance}% hit`,
                `Peg power x${mult.toFixed(2)}`
            ];
        }

        return [
            `Lv ${this.level} • ${chance}%`,
            `Next: stronger peg gold`
        ];
    }

    rollBonus(
        baseMultiplier: number
    ): number {

        const roll =
            Math.floor(Math.random() * 100) + 1;

        if (roll > this.getChance()) {
            return 0;
        }

        return Math.max(
            1,
            Math.round(
                EconomyConfig.LUCKY_PEG_BASE_BONUS *
                baseMultiplier *
                this.getBonusMultiplier()
            )
        );
    }
}
