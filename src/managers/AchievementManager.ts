import type { Achievement } from "../game/Achievement";
import { ACHIEVEMENT_CONFIG } from "../config/AchievementConfig";
import { StatisticsManager } from "./StatisticsManager";

export class AchievementManager {

    private achievements: Achievement[];

    constructor() {

        this.achievements =
            ACHIEVEMENT_CONFIG.map(
                achievement => ({
                    ...achievement
                })
            );
    }

    getAchievements(): Achievement[] {

        return this.achievements;
    }

    setAchievements(
        achievements: Achievement[]
    ): void {

        this.achievements =
            achievements;
    }

    update(
        statistics: StatisticsManager,
        onUnlock: (
            achievement: Achievement
        ) => void
    ): void {

        const totalBalls =
            statistics.getTotalBallsDropped();

        const totalMoney =
            statistics.getTotalMoneyEarned();

        const totalGoldenBalls =
            statistics.getTotalGoldenBallsDropped();

        for (
            const achievement
            of this.achievements
        ) {

            switch (
                achievement.id
            ) {

                case "balls":

                    achievement.current =
                        totalBalls;

                    break;

                case "money":

                    achievement.current =
                        totalMoney;

                    break;

                case "golden":

                    achievement.current =
                        totalGoldenBalls;

                    break;
            }

            while (
                achievement.current >=
                achievement.target
            ) {

                onUnlock(
                    achievement
                );

                achievement.level++;

                achievement.reward =
                    achievement.level;

                achievement.target =
                    Math.floor(
                        achievement.target * 10
                    );
            }
        }
    }
}