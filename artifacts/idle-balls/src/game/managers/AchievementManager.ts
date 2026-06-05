import { ACHIEVEMENT_CONFIG, AchievementDef } from "../config/AchievementConfig";
import { StatisticsManager } from "./StatisticsManager";

export interface AchievementState {
    def: AchievementDef;
    currentMilestone: number;
    current: number;
}

export class AchievementManager {
    private states: AchievementState[];

    constructor() {
        this.states = ACHIEVEMENT_CONFIG.map(def => ({
            def,
            currentMilestone: 0,
            current: 0,
        }));
    }

    setProgress(data: Record<string, number>): void {
        for (const state of this.states) {
            state.currentMilestone = data[state.def.id] ?? 0;
        }
    }

    getProgress(): Record<string, number> {
        const out: Record<string, number> = {};
        for (const s of this.states) out[s.def.id] = s.currentMilestone;
        return out;
    }

    getStates(): AchievementState[] { return this.states; }

    update(
        stats: StatisticsManager,
        autoDropperLevel: number,
        bestCombo: number,
        dailyStreak: number,
        totalPegBonuses: number,
        prestigeCount: number,
        critCount: number,
        starHitCount: number,
        doubleStrikeCount: number,
        onUnlock: (state: AchievementState, ap: number) => void
    ): void {
        const all = stats.getAll();

        const getValue = (id: string): number => {
            switch (id) {
                case "ball_dropper":    return all.totalBallsDropped;
                case "rich":            return all.totalMoneyEarned;
                case "gold_hunter":     return all.totalGoldenBallsDropped;
                case "shopaholic":      return all.totalShopPurchases;
                case "jackpot":         return all.bestSingleHit;
                case "automation":      return autoDropperLevel;
                case "combo_master":    return Math.max(all.bestCombo, bestCombo);
                case "peg_buster":      return totalPegBonuses;
                case "daily_devotion":  return dailyStreak;
                case "prestige":        return prestigeCount;
                case "critical_master": return critCount;
                case "star_hunter":     return starHitCount;
                case "double_striker":  return doubleStrikeCount;
                default:                return 0;
            }
        };

        for (const state of this.states) {
            const val = getValue(state.def.id);
            state.current = val;

            while (state.currentMilestone < state.def.milestones.length) {
                const ms = state.def.milestones[state.currentMilestone];
                if (val >= ms.target) {
                    state.currentMilestone++;
                    onUnlock(state, ms.ap);
                } else {
                    break;
                }
            }
        }
    }
}
