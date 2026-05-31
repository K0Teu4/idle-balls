export interface SaveData {

    version: number;

    money: number;

    autoDropperLevel: number;

    multiplierLevel: number;

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

            typeof save.lastSaveTime ===
                "number"
        );
    }
}