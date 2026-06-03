import { EconomyConfig } from "../config/EconomyConfig";
import { getAverageSlotValue } from "../utils/SlotMath";

export interface BackgroundSimInput {

    elapsedMs: number;

    ballsPerSecond: number;

    autoDropMultiplier: number;

    multiplier: number;

    goldenChance: number;

    goldenRewardMultiplier: number;

    incomeBoostMultiplier: number;

    ballCost: number;
}

export interface BackgroundSimResult {

    income: number;

    secondsSimulated: number;
}

export function simulateBackgroundTime(
    input: BackgroundSimInput
): BackgroundSimResult | null {

    const seconds =
        Math.min(
            EconomyConfig.BACKGROUND_MAX_SECONDS,
            Math.floor(input.elapsedMs / 1000)
        );

    if (seconds < 1) {
        return null;
    }

    const rate =
        input.ballsPerSecond *
        input.autoDropMultiplier;

    if (rate <= 0) {
        return null;
    }

    const balls = seconds * rate;
    const average = getAverageSlotValue();

    const goldenBonus =
        1 +
        (
            Math.min(
                input.goldenChance,
                EconomyConfig.GOLDEN_BALL_MAX_CHANCE
            ) / 100
        ) *
        (input.goldenRewardMultiplier - 1);

    const gross =
        balls *
        average *
        input.multiplier *
        goldenBonus *
        input.incomeBoostMultiplier;

    const net = Math.floor(
        gross - balls * input.ballCost
    );

    if (net <= 0) {
        return null;
    }

    return {
        income: net,
        secondsSimulated: seconds
    };
}
