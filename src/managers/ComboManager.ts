import { EconomyConfig } from "../config/EconomyConfig";
import type { ApShopManager } from "./ApShopManager";

export class ComboManager {

    private combo = 0;

    private bestCombo = 0;

    private lastHitAt = 0;

    private apShop: ApShopManager | null = null;

    bindApShop(apShop: ApShopManager): void {

        this.apShop = apShop;
    }

    private getWindowMs(): number {

        const bonus =
            this.apShop?.getComboWindowBonusMs() ?? 0;

        return (
            EconomyConfig.COMBO_WINDOW_MS + bonus
        );
    }

    private getMaxStack(): number {

        const bonus =
            this.apShop?.getComboMaxStackBonus() ?? 0;

        return (
            EconomyConfig.COMBO_MAX_STACK + bonus
        );
    }

    registerHit(): {
        multiplier: number;
        count: number;
    } {

        const now = Date.now();

        if (now - this.lastHitAt > this.getWindowMs()) {
            this.combo = 0;
        }

        this.combo++;
        this.lastHitAt = now;

        if (this.combo > this.bestCombo) {
            this.bestCombo = this.combo;
        }

        return {
            multiplier: this.getMultiplier(),
            count: this.getDisplayCombo()
        };
    }

    getDisplayCombo(): number {

        return Math.min(
            this.getCombo(),
            this.getMaxStack()
        );
    }

    getCombo(): number {

        const now = Date.now();

        if (now - this.lastHitAt > this.getWindowMs()) {
            return 0;
        }

        return this.combo;
    }

    getMultiplier(): number {

        const stacks = Math.min(
            Math.max(0, this.getDisplayCombo() - 1),
            this.getMaxStack() - 1
        );

        return (
            1 +
            stacks * EconomyConfig.COMBO_BONUS_PER_STACK
        );
    }

    getBestCombo(): number {

        return this.bestCombo;
    }

    setBestCombo(value: number): void {

        this.bestCombo = value;
    }

    getTimeLeftMs(): number {

        if (this.lastHitAt === 0) {
            return 0;
        }

        return Math.max(
            0,
            this.getWindowMs() -
            (Date.now() - this.lastHitAt)
        );
    }

    getBonusPercent(): number {

        return Math.round(
            (this.getMultiplier() - 1) * 100
        );
    }
}
