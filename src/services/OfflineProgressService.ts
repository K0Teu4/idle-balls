import { EconomyConfig } from "../config/EconomyConfig";
import { getAverageSlotValue } from "../utils/SlotMath";

export interface OfflineProgressInput {

    lastSaveTime: number;

    ballsPerSecond: number;

    autoDropMultiplier: number;

    multiplier: number;

    goldenChance: number;

    goldenRewardMultiplier: number;

    incomeBoostMultiplier: number;

    ballCost: number;
}

export interface OfflineProgressResult {

    income: number;

    secondsAway: number;
}

export function calculateOfflineProgress(
    input: OfflineProgressInput
): OfflineProgressResult | null {

    const secondsAway =
        Math.min(
            EconomyConfig.OFFLINE_MAX_SECONDS,
            Math.floor(
                (
                    Date.now() -
                    input.lastSaveTime
                ) / 1000
            )
        );

    if (
        secondsAway <
        EconomyConfig.OFFLINE_MIN_SECONDS
    ) {
        return null;
    }

    const rate =
        input.ballsPerSecond *
        input.autoDropMultiplier;

    if (rate <= 0) {
        return null;
    }

    const ballsProduced =
        secondsAway * rate;

    const averageSlot =
        getAverageSlotValue();

    const goldenBonus =
        1 +
        (
            Math.min(
                input.goldenChance,
                EconomyConfig.GOLDEN_BALL_MAX_CHANCE
            ) / 100
        ) *
        (
            input.goldenRewardMultiplier - 1
        );

    const grossIncome =
        ballsProduced *
        averageSlot *
        input.multiplier *
        goldenBonus *
        input.incomeBoostMultiplier;

    const netIncome =
        Math.floor(
            grossIncome -
            ballsProduced * input.ballCost
        );

    if (netIncome <= 0) {
        return null;
    }

    return {
        income: netIncome,
        secondsAway
    };
}
