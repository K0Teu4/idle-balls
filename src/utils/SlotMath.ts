import { SLOT_VALUES } from "../config/GameConfig";

export function getAverageSlotValue(): number {

    if (SLOT_VALUES.length === 0) {
        return 0;
    }

    const sum =
        SLOT_VALUES.reduce(
            (total, value) => total + value,
            0
        );

    return sum / SLOT_VALUES.length;
}

export function computeSlotReward(
    baseValue: number,
    multiplier: number,
    isGolden: boolean,
    goldenRewardMultiplier: number
): number {

    let reward =
        Math.round(
            baseValue * multiplier
        );

    if (isGolden) {
        reward = Math.round(
            reward * goldenRewardMultiplier
        );
    }

    return reward;
}

export function formatSlotDisplayValue(
    baseValue: number,
    multiplier: number
): string {

    return (
        baseValue * multiplier
    ).toFixed(1);
}
