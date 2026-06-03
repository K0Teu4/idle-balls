import {
    getApUpgradeCost,
    type ApShopUpgradeId
} from "../config/ApShopConfig";

const DISCOUNT_SOFT_CAP = 10;

const GOLDEN_SOFT_CAP = 12;

export class ApShopManager {

    private incomeLevel = 0;

    private discountLevel = 0;

    private goldenLevel = 0;

    private comboLevel = 0;

    setLevels(
        income: number,
        discount: number,
        golden: number,
        combo: number
    ): void {

        this.incomeLevel = income;
        this.discountLevel = discount;
        this.goldenLevel = golden;
        this.comboLevel = combo;
    }

    getIncomeLevel(): number {

        return this.incomeLevel;
    }

    getDiscountLevel(): number {

        return this.discountLevel;
    }

    getGoldenLevel(): number {

        return this.goldenLevel;
    }

    getComboLevel(): number {

        return this.comboLevel;
    }

    getIncomeMultiplier(): number {

        let mult =
            1 + this.incomeLevel * 0.04;

        const discountOver = Math.max(
            0,
            this.discountLevel - DISCOUNT_SOFT_CAP
        );

        mult += discountOver * 0.03;

        const goldenOver = Math.max(
            0,
            this.goldenLevel - GOLDEN_SOFT_CAP
        );

        mult += goldenOver * 0.02;

        return mult;
    }

    getBallCostMultiplier(): number {

        const capped = Math.min(
            this.discountLevel,
            DISCOUNT_SOFT_CAP
        );

        return Math.max(
            0.4,
            1 - capped * 0.04
        );
    }

    getGoldenRewardBonus(): number {

        const capped = Math.min(
            this.goldenLevel,
            GOLDEN_SOFT_CAP
        );

        return capped * 0.4;
    }

    getComboWindowBonusMs(): number {

        return Math.floor(this.comboLevel / 2) * 120;
    }

    getComboMaxStackBonus(): number {

        return Math.floor(this.comboLevel / 2);
    }

    getLevel(id: ApShopUpgradeId): number {

        switch (id) {

            case "income":
                return this.incomeLevel;

            case "discount":
                return this.discountLevel;

            case "golden":
                return this.goldenLevel;

            case "combo":
                return this.comboLevel;
        }
    }

    isMaxed(_id: ApShopUpgradeId): boolean {

        return false;
    }

    getCost(id: ApShopUpgradeId): number {

        return getApUpgradeCost(this.getLevel(id));
    }

    getUpgradeDescription(
        id: ApShopUpgradeId
    ): string {

        const level = this.getLevel(id);

        switch (id) {

            case "income":
                return `+${Math.round((this.getIncomeMultiplier() - 1) * 100)}% income now`;

            case "discount": {

                if (level >= DISCOUNT_SOFT_CAP) {
                    return `Past cap: +3% income / lv`;
                }

                return `Ball cost x${this.getBallCostMultiplier().toFixed(2)}`;
            }

            case "golden": {

                if (level >= GOLDEN_SOFT_CAP) {
                    return `Past cap: +2% income / lv`;
                }

                return `+${this.getGoldenRewardBonus().toFixed(1)}× golden`;
            }

            case "combo":
                return `Window +${this.getComboWindowBonusMs()}ms, stack +${this.getComboMaxStackBonus()}`;
        }
    }

    buy(id: ApShopUpgradeId): boolean {

        switch (id) {

            case "income":
                this.incomeLevel++;
                return true;

            case "discount":
                this.discountLevel++;
                return true;

            case "golden":
                this.goldenLevel++;
                return true;

            case "combo":
                this.comboLevel++;
                return true;
        }
    }
}
