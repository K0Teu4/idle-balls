import type { Achievement } from "../game/Achievement";
import { ACHIEVEMENT_CONFIG } from "../config/AchievementConfig";
import { mergeAchievementsWithConfig } from "../utils/AchievementMerge";
import type { StatisticsManager } from "./StatisticsManager";

const MAX_UNLOCKS_PER_FRAME = 2;

export interface AchievementGameState {

    statistics: StatisticsManager;

    autoDropperLevel: number;

    totalShopPurchases: number;

    bestCombo: number;
}

export class AchievementManager {

    private achievements: Achievement[];

    private readonly maxUnlocksPerFrame =
        MAX_UNLOCKS_PER_FRAME;

    constructor() {

        this.achievements =
            mergeAchievementsWithConfig(
                undefined
            );
    }

    getAchievements(): Achievement[] {

        return this.achievements;
    }

    setAchievements(
        achievements: Achievement[]
    ): void {

        this.achievements =
            mergeAchievementsWithConfig(
                achievements
            );
    }

    syncTiersFromProgress(
        state: AchievementGameState
    ): void {

        this.syncCurrentValues(state);

        for (
            const achievement
            of this.achievements
        ) {

            while (
                achievement.current >=
                achievement.target
            ) {

                achievement.level++;

                achievement.reward =
                    this.computeReward(
                        achievement
                    );

                achievement.target =
                    Math.floor(
                        achievement.target * 10
                    );
            }
        }
    }

    update(
        state: AchievementGameState,
        onUnlock: (
            achievement: Achievement
        ) => void
    ): number {

        this.syncCurrentValues(state);

        let unlocks = 0;

        for (
            const achievement
            of this.achievements
        ) {

            while (
                achievement.current >=
                achievement.target &&
                unlocks <
                this.maxUnlocksPerFrame
            ) {

                onUnlock(achievement);

                achievement.level++;

                achievement.reward =
                    this.computeReward(
                        achievement
                    );

                achievement.target =
                    Math.floor(
                        achievement.target * 10
                    );

                unlocks++;
            }
        }

        return unlocks;
    }

    private syncCurrentValues(
        state: AchievementGameState
    ): void {

        const stats =
            state.statistics;

        for (
            const achievement
            of this.achievements
        ) {

            switch (achievement.id) {

                case "balls":
                    achievement.current =
                        stats.getTotalBallsDropped();
                    break;

                case "money":
                    achievement.current =
                        stats.getTotalMoneyEarned();
                    break;

                case "golden":
                    achievement.current =
                        stats.getTotalGoldenBallsDropped();
                    break;

                case "shop":
                    achievement.current =
                        state.totalShopPurchases;
                    break;

                case "big_win":
                    achievement.current =
                        stats.getHighestSingleReward();
                    break;

                case "auto":
                    achievement.current =
                        state.autoDropperLevel;
                    break;

                case "combo":
                    achievement.current =
                        state.bestCombo;
                    break;

                case "peg":
                    achievement.current =
                        stats.getTotalPegBonuses();
                    break;

                case "slots":
                    achievement.current =
                        stats.getTotalSlotHits();
                    break;
            }
        }
    }

    private computeReward(
        achievement: Achievement
    ): number {

        const base =
            ACHIEVEMENT_CONFIG.find(
                a => a.id === achievement.id
            )?.reward ?? 1;

        return base * achievement.level;
    }
}
