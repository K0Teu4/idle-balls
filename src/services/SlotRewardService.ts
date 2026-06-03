import Phaser from "phaser";

import { Ball } from "../game/Ball";
import { Slot } from "../game/Slot";
import { FloatingText } from "../game/FloatingText";
import { GoldenBurst } from "../game/GoldenBurst";
import { GAME_AREA, SLOT_HEIGHT } from "../config/GameConfig";
import { computeSlotReward } from "../utils/SlotMath";
import { formatNumber } from "../utils/NumberFormatter";

export interface SlotRewardContext {

    multiplier: number;

    goldenRewardMultiplier: number;

    incomeBoostMultiplier: number;
}

export interface SlotRewardCallbacks {

    registerComboHit: () => {
        multiplier: number;
        count: number;
    };

    onReward: (
        reward: number,
        isGolden: boolean,
        combo: number
    ) => void;
}

export class SlotRewardService {

    private readonly slotLine: number;

    private readonly destroyLine: number;

    constructor() {

        this.slotLine =
            GAME_AREA.y +
            GAME_AREA.height -
            SLOT_HEIGHT;

        this.destroyLine =
            GAME_AREA.y +
            GAME_AREA.height +
            30;
    }

    processBalls(
        scene: Phaser.Scene,
        balls: Ball[],
        slots: Slot[],
        context: SlotRewardContext,
        callbacks: SlotRewardCallbacks
    ): void {

        for (const ball of balls) {

            if (ball.destroyed) {
                continue;
            }

            const ballY = ball.getY();

            if (ballY < this.slotLine) {
                continue;
            }

            const ballX = ball.getX();
            let matched = false;

            for (const slot of slots) {

                if (!slot.contains(ballX)) {
                    continue;
                }

                matched = true;

                const combo =
                    callbacks.registerComboHit();

                const comboMult = combo.multiplier;
                const comboCount = combo.count;

                let reward = computeSlotReward(
                    slot.value,
                    context.multiplier,
                    ball.isGolden(),
                    context.goldenRewardMultiplier
                );

                reward = Math.round(
                    reward *
                    context.incomeBoostMultiplier *
                    comboMult
                );

                if (ball.isGolden()) {

                    GoldenBurst.create(
                        scene,
                        ballX,
                        this.slotLine - 40
                    );

                    FloatingText.create(
                        scene,
                        ballX,
                        this.slotLine - 50,
                        "GOLD!",
                        "#ffdd33"
                    );
                }

                if (comboMult > 1) {

                    FloatingText.create(
                        scene,
                        ballX,
                        this.slotLine - 70,
                        `${comboCount}x COMBO!`,
                        "#ff88cc",
                        22
                    );
                }

                callbacks.onReward(
                    reward,
                    ball.isGolden(),
                    comboCount
                );

                FloatingText.create(
                    scene,
                    ballX,
                    this.slotLine - 25,
                    `+${formatNumber(reward)}`
                );

                ball.destroy(scene);
                break;
            }

            if (!matched && ballY > this.destroyLine) {
                ball.destroy(scene);
            }
        }
    }
}
