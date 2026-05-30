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

            return JSON.parse(raw);

        } catch {

            return null;
        }
    }
}