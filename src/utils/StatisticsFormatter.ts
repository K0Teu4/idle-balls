import { formatNumber } from "./NumberFormatter";
import { formatPlayTime } from "./TimeFormat";
import type { StatisticsManager } from "../managers/StatisticsManager";
import type { ComboManager } from "../managers/ComboManager";
import type { IncomeTracker } from "../managers/IncomeTracker";
import type { DailyBonusManager } from "../managers/DailyBonusManager";

export interface StatisticsViewModel {

    statistics: StatisticsManager;

    combo: ComboManager;

    incomeTracker: IncomeTracker;

    dailyBonus: DailyBonusManager;

    currentMoney: number;

    autoRate: number;

    autoDropBonusPercent: number;

    multiplier: number;

    incomeBoostPercent: number;
}

export interface StatRow {

    label: string;

    value: string;

    section?: boolean;
}

export function buildStatisticsRows(
    model: StatisticsViewModel
): StatRow[] {

    const stats = model.statistics;
    const incomePerSec = model.incomeTracker.getPerSecond();
    const activityMax = Math.max(
        incomePerSec * 1.5,
        stats.getSessionMoneyEarned() /
        Math.max(1, stats.getSessionSeconds()),
        50
    );
    const activityPct = Math.min(
        100,
        Math.round((incomePerSec / activityMax) * 100)
    );

    return [
        { label: "LIFETIME", value: "", section: true },
        {
            label: "Money earned",
            value: formatNumber(stats.getTotalMoneyEarned())
        },
        {
            label: "Balls dropped",
            value: formatNumber(stats.getTotalBallsDropped())
        },
        {
            label: "Slot hits",
            value: formatNumber(stats.getTotalSlotHits())
        },
        {
            label: "Golden balls",
            value: formatNumber(stats.getTotalGoldenBallsDropped())
        },
        {
            label: "Peg bonuses",
            value: `${formatNumber(stats.getTotalPegBonuses())} (${formatNumber(stats.getTotalPegBonusMoney())})`
        },
        {
            label: "Shop purchases",
            value: formatNumber(stats.getTotalShopPurchases())
        },
        {
            label: "Best single hit",
            value: formatNumber(stats.getHighestSingleReward())
        },
        {
            label: "Best combo",
            value: `×${model.combo.getBestCombo()}`
        },
        {
            label: "Play time",
            value: formatPlayTime(stats.getTotalPlayTimeSeconds())
        },

        { label: "SESSION", value: "", section: true },
        {
            label: "Earned",
            value: formatNumber(stats.getSessionMoneyEarned())
        },
        {
            label: "Duration",
            value: formatPlayTime(stats.getSessionSeconds())
        },
        {
            label: "Income rate",
            value: `${formatNumber(incomePerSec)}/s`
        },
        {
            label: "Activity",
            value: `${activityPct}%`
        },

        { label: "LIVE", value: "", section: true },
        {
            label: "Money",
            value: formatNumber(model.currentMoney)
        },
        {
            label: "Auto-drop",
            value: `${model.autoRate}/s (+${model.autoDropBonusPercent}%)`
        },
        {
            label: "Multiplier",
            value: `×${model.multiplier.toFixed(2)}`
        },
        {
            label: "Income boost",
            value: `+${model.incomeBoostPercent}%`
        },
        {
            label: "Daily streak",
            value: `${model.dailyBonus.getStreak()} day(s)`
        },
        {
            label: "Daily bonus",
            value: model.dailyBonus.canClaim()
                ? "Ready!"
                : "Claimed"
        }
    ];
}
