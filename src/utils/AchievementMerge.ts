import type { Achievement } from "../game/Achievement";
import { ACHIEVEMENT_CONFIG } from "../config/AchievementConfig";

export function mergeAchievementsWithConfig(
    saved: Achievement[] | undefined
): Achievement[] {

    const byId =
        new Map<string, Achievement>();

    for (
        const template
        of ACHIEVEMENT_CONFIG
    ) {

        byId.set(
            template.id,
            { ...template }
        );
    }

    if (saved) {

        for (
            const item of saved
        ) {

            const existing =
                byId.get(item.id);

            if (!existing) {
                continue;
            }

            existing.level = item.level;
            existing.reward = item.reward;
            existing.current = item.current;
            existing.target = item.target;
        }
    }

    return Array.from(
        byId.values()
    );
}
