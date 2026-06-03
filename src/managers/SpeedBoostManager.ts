import { EconomyConfig } from "../config/EconomyConfig";

export class SpeedBoostManager {

    private level = 0;

    setLevel(level: number): void {

        this.level = level;
    }

    getLevel(): number {

        return this.level;
    }

    getCost(): number {

        return Math.floor(
            EconomyConfig.SPEED_BOOST_BASE_COST *
            Math.pow(
                EconomyConfig.SPEED_BOOST_COST_MULT,
                this.level
            )
        );
    }

    buy(): void {

        this.level++;
    }

    private getCooldownCapLevel(): number {

        const span =
            EconomyConfig.BALL_SPAWN_COOLDOWN_MS -
            EconomyConfig.MIN_SPAWN_COOLDOWN_MS;

        return Math.ceil(
            span / EconomyConfig.SPEED_BOOST_MS_PER_LEVEL
        );
    }

    getOvercapLevel(): number {

        return Math.max(
            0,
            this.level - this.getCooldownCapLevel()
        );
    }

    getSpawnCooldownMs(): number {

        return Math.max(
            EconomyConfig.MIN_SPAWN_COOLDOWN_MS,
            EconomyConfig.BALL_SPAWN_COOLDOWN_MS -
            this.level *
            EconomyConfig.SPEED_BOOST_MS_PER_LEVEL
        );
    }

    /** Extra auto-dropper output after cooldown is mined. */
    getAutoDropMultiplier(): number {

        return (
            1 +
            this.getOvercapLevel() *
            EconomyConfig.SPEED_BOOST_OVERLEVEL_AUTO_MULT
        );
    }

    getInfoLines(): string[] {

        const over = this.getOvercapLevel();

        if (over > 0) {
            return [
                `Lv ${this.level} • ${this.getSpawnCooldownMs()}ms`,
                `Auto +${Math.round(this.getAutoDropMultiplier() * 100 - 100)}%`
            ];
        }

        return [
            `Lv ${this.level} • ${this.getSpawnCooldownMs()}ms drop`,
            `Past cap: +4% auto / lv`
        ];
    }

    getLabel(): string {

        const ms = this.getSpawnCooldownMs();

        if (this.getOvercapLevel() > 0) {
            return `${ms}ms +auto`;
        }

        return `${ms}ms`;
    }
}
