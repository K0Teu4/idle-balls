import type { Achievement } from "../game/Achievement";

export interface SaveData {

    version: number;

    money: number;

    autoDropperLevel: number;

    multiplierLevel: number;

    ballCapacityLevel: number;

    goldenBallLevel: number;

    totalMoneyEarned: number;

    totalBallsDropped: number;

    totalGoldenBallsDropped: number;

    achievementPoints: number;

    achievements: Achievement[];

    lastSaveTime: number;
}

export class SaveManager {

    private static readonly KEY =
        "idle-balls-save";

    static save(
        data: SaveData
    ): void {

        localStorage.setItem(
            this.KEY,
            JSON.stringify(data)
        );
    }

    static load(): SaveData | null {

        const raw =
            localStorage.getItem(
                this.KEY
            );

        if (!raw) {
            return null;
        }

        try {

            const parsed =
                JSON.parse(raw);

            if (
                typeof parsed !== "object" ||
                parsed === null
            ) {
                return null;
            }

            parsed.totalMoneyEarned ??= 0;
            parsed.totalBallsDropped ??= 0;
            parsed.totalGoldenBallsDropped ??= 0;
            parsed.achievementPoints ??= 0;
            parsed.achievements ??= [];

            if (
                !this.isValidSave(
                    parsed
                )
            ) {
                return null;
            }

            return parsed;

        } catch {

            return null;
        }
    }

    private static isValidSave(
        data: unknown
    ): data is SaveData {

        if (
            typeof data !==
            "object"
            || data === null
        ) {
            return false;
        }

        const save =
            data as SaveData;

        return (

            typeof save.version ===
                "number" &&

            typeof save.money ===
                "number" &&

            typeof save.autoDropperLevel ===
                "number" &&

            typeof save.multiplierLevel ===
                "number" &&

            typeof save.ballCapacityLevel ===
                "number" &&

            typeof save.goldenBallLevel ===
                "number" &&

            typeof save.totalMoneyEarned ===
                "number" &&

            typeof save.totalBallsDropped ===
                "number" &&
                
            typeof save.totalGoldenBallsDropped ===
                "number" &&

            typeof save.achievementPoints ===
                "number" &&

            Array.isArray(
                save.achievements
            ) &&

            typeof save.lastSaveTime ===
                "number"
        );
    }
}