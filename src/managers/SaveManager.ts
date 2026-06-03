import type { Achievement } from "../game/Achievement";
import { migrateSave } from "./SaveMigrator";

export interface SaveData {

    version: number;

    money: number;

    autoDropperLevel: number;

    multiplierLevel: number;

    ballCapacityLevel: number;

    goldenBallLevel: number;

    luckyPegLevel: number;

    speedBoostLevel: number;

    totalMoneyEarned: number;

    totalBallsDropped: number;

    totalGoldenBallsDropped: number;

    achievementPoints: number;

    achievements: Achievement[];

    lastSaveTime: number;

    totalPlayTimeSeconds: number;

    highestSingleReward: number;

    totalShopPurchases: number;

    apIncomeBoostLevel: number;

    apBallDiscountLevel: number;

    apGoldenBoostLevel: number;

    apComboBoostLevel: number;

    bestCombo: number;

    totalSlotHits: number;

    totalPegBonuses: number;

    totalPegBonusMoney: number;

    dailyLastClaimDay: string;

    dailyStreak: number;
}

export class SaveManager {

    private static readonly KEY =
        "idle-balls-save";

    static save(data: SaveData): void {

        localStorage.setItem(
            this.KEY,
            JSON.stringify(data)
        );
    }

    static load(): SaveData | null {

        const raw =
            localStorage.getItem(this.KEY);

        if (!raw) {
            return null;
        }

        try {

            const parsed =
                JSON.parse(raw) as Record<string, unknown>;

            if (
                typeof parsed !== "object" ||
                parsed === null
            ) {
                return null;
            }

            if (!this.isValidRaw(parsed)) {
                return null;
            }

            return migrateSave(parsed);

        } catch {

            return null;
        }
    }

    private static isValidRaw(
        data: Record<string, unknown>
    ): boolean {

        const requiredNumbers = [
            "money",
            "autoDropperLevel",
            "multiplierLevel",
            "ballCapacityLevel",
            "goldenBallLevel",
            "lastSaveTime"
        ];

        for (const key of requiredNumbers) {

            if (typeof data[key] !== "number") {
                return false;
            }
        }

        return true;
    }
}
