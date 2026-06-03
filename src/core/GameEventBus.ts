export type GameEventMap = {

    "slot:hit": {
        reward: number;
        isGolden: boolean;
        combo: number;
    };

    "peg:bonus": {
        bonus: number;
    };

    "achievement:unlock": {
        reward: number;
        title: string;
    };

    "daily:claim": {
        reward: number;
        streak: number;
    };

    "shop:purchase": {
        item: string;
    };
};

type Handler<T> = (payload: T) => void;

export class GameEventBus {

    private readonly handlers =
        new Map<string, Set<Handler<unknown>>>();

    on<K extends keyof GameEventMap>(
        event: K,
        handler: Handler<GameEventMap[K]>
    ): void {

        const key = event as string;

        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }

        this.handlers.get(key)!.add(
            handler as Handler<unknown>
        );
    }

    emit<K extends keyof GameEventMap>(
        event: K,
        payload: GameEventMap[K]
    ): void {

        const set =
            this.handlers.get(event as string);

        if (!set) {
            return;
        }

        for (const handler of set) {
            handler(payload);
        }
    }
}
