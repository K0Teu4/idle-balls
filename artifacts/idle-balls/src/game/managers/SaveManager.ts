export interface SaveData {
    version: number;
    money: number;
    autoDropperLevel: number;
    multiplierLevel: number;
    ballCapacityLevel: number;
    goldenBallLevel: number;
    luckyPegLevel: number;
    speedLevel: number;
    doubleStrikeLevel: number;
    insuranceLevel: number;
    bankLevel: number;
    apShopLevels: Record<string, number>;
    totalMoneyEarned: number;
    totalBallsDropped: number;
    totalGoldenBallsDropped: number;
    totalSlotHits: number;
    totalPegBonuses: number;
    totalShopPurchases: number;
    bestSingleHit: number;
    bestCombo: number;
    totalPlayTimeSec: number;
    totalAP: number;
    spentAP: number;
    achievementProgress: Record<string, number>;
    lastDailyDate: string | null;
    dailyStreak: number;
    lastSaveTime: number;
    prestigeCount: number;
    prestigeTotalPP: number;
    prestigeSpentPP: number;
    prestigeShopLevels: Record<string, number>;
    critCount: number;
    starHitCount: number;
    doubleStrikeCount: number;
    totalPegBonusCount: number;
}

const KEY = "idle-balls-save-v4";
const CURRENT_VERSION = 4;

export class SaveManager {
    static save(data: SaveData): void {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch { }
    }

    static load(): SaveData | null {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as Partial<SaveData>;
            if (!parsed || typeof parsed !== "object") return null;

            return {
                version: CURRENT_VERSION,
                money: parsed.money ?? 10,
                autoDropperLevel: parsed.autoDropperLevel ?? 0,
                multiplierLevel: parsed.multiplierLevel ?? 0,
                ballCapacityLevel: parsed.ballCapacityLevel ?? 0,
                goldenBallLevel: parsed.goldenBallLevel ?? 0,
                luckyPegLevel: parsed.luckyPegLevel ?? 0,
                speedLevel: parsed.speedLevel ?? 0,
                doubleStrikeLevel: parsed.doubleStrikeLevel ?? 0,
                insuranceLevel: parsed.insuranceLevel ?? 0,
                bankLevel: parsed.bankLevel ?? 0,
                apShopLevels: parsed.apShopLevels ?? {},
                totalMoneyEarned: parsed.totalMoneyEarned ?? 0,
                totalBallsDropped: parsed.totalBallsDropped ?? 0,
                totalGoldenBallsDropped: parsed.totalGoldenBallsDropped ?? 0,
                totalSlotHits: parsed.totalSlotHits ?? 0,
                totalPegBonuses: parsed.totalPegBonuses ?? 0,
                totalShopPurchases: parsed.totalShopPurchases ?? 0,
                bestSingleHit: parsed.bestSingleHit ?? 0,
                bestCombo: parsed.bestCombo ?? 0,
                totalPlayTimeSec: parsed.totalPlayTimeSec ?? 0,
                totalAP: parsed.totalAP ?? 0,
                spentAP: parsed.spentAP ?? 0,
                achievementProgress: parsed.achievementProgress ?? {},
                lastDailyDate: parsed.lastDailyDate ?? null,
                dailyStreak: parsed.dailyStreak ?? 0,
                lastSaveTime: parsed.lastSaveTime ?? Date.now(),
                prestigeCount: parsed.prestigeCount ?? 0,
                prestigeTotalPP: parsed.prestigeTotalPP ?? 0,
                prestigeSpentPP: parsed.prestigeSpentPP ?? 0,
                prestigeShopLevels: parsed.prestigeShopLevels ?? {},
                critCount: parsed.critCount ?? 0,
                starHitCount: parsed.starHitCount ?? 0,
                doubleStrikeCount: parsed.doubleStrikeCount ?? 0,
                totalPegBonusCount: parsed.totalPegBonusCount ?? 0,
            };
        } catch {
            return null;
        }
    }

    static clear(): void {
        localStorage.removeItem(KEY);
    }
}
