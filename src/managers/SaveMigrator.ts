import type { SaveData } from "./SaveManager";
import { mergeAchievementsWithConfig } from "../utils/AchievementMerge";

const CURRENT_VERSION = 6;

export function migrateSave(
    raw: Record<string, unknown>
): SaveData | null {

    raw.totalMoneyEarned ??= 0;
    raw.totalBallsDropped ??= 0;
    raw.totalGoldenBallsDropped ??= 0;
    raw.achievementPoints ??= 0;
    raw.achievements ??= [];
    raw.totalPlayTimeSeconds ??= 0;
    raw.highestSingleReward ??= 0;
    raw.totalShopPurchases ??= 0;
    raw.apIncomeBoostLevel ??= 0;
    raw.apBallDiscountLevel ??= 0;
    raw.apGoldenBoostLevel ??= 0;
    raw.luckyPegLevel ??= 0;
    raw.speedBoostLevel ??= 0;
    raw.bestCombo ??= 0;
    raw.totalSlotHits ??= 0;
    raw.totalPegBonuses ??= 0;
    raw.totalPegBonusMoney ??= 0;
    raw.dailyLastClaimDay ??= "";
    raw.dailyStreak ??= 0;
    raw.apComboBoostLevel ??= 0;

    raw.version = CURRENT_VERSION;

    const achievements =
        mergeAchievementsWithConfig(
            raw.achievements as SaveData["achievements"]
        );

    return {
        version: CURRENT_VERSION,
        money: Number(raw.money),
        autoDropperLevel: Number(raw.autoDropperLevel),
        multiplierLevel: Number(raw.multiplierLevel),
        ballCapacityLevel: Number(raw.ballCapacityLevel),
        goldenBallLevel: Number(raw.goldenBallLevel),
        totalMoneyEarned: Number(raw.totalMoneyEarned),
        totalBallsDropped: Number(raw.totalBallsDropped),
        totalGoldenBallsDropped: Number(raw.totalGoldenBallsDropped),
        achievementPoints: Number(raw.achievementPoints),
        achievements,
        lastSaveTime: Number(raw.lastSaveTime),
        totalPlayTimeSeconds: Number(raw.totalPlayTimeSeconds),
        highestSingleReward: Number(raw.highestSingleReward),
        totalShopPurchases: Number(raw.totalShopPurchases),
        apIncomeBoostLevel: Number(raw.apIncomeBoostLevel),
        apBallDiscountLevel: Number(raw.apBallDiscountLevel),
        apGoldenBoostLevel: Number(raw.apGoldenBoostLevel),
        apComboBoostLevel: Number(raw.apComboBoostLevel),
        luckyPegLevel: Number(raw.luckyPegLevel),
        speedBoostLevel: Number(raw.speedBoostLevel),
        bestCombo: Number(raw.bestCombo),
        totalSlotHits: Number(raw.totalSlotHits),
        totalPegBonuses: Number(raw.totalPegBonuses),
        totalPegBonusMoney: Number(raw.totalPegBonusMoney),
        dailyLastClaimDay: String(raw.dailyLastClaimDay),
        dailyStreak: Number(raw.dailyStreak)
    };
}
