---
name: Idle Balls game architecture
description: Key design decisions for the Idle Balls Phaser 4 game
---

## Slot hit detection via Y-threshold (not physics)

Balls don't have a physics collision with the slot bottom. Instead, `checkBallsBottom()` in GameScene polls each ball's Y position every frame and triggers `onSlotHit()` when Y > threshold.

**Why:** Simpler and more reliable than Matter.js collision events for detecting "which slot" the ball lands in. X position at threshold determines which slot.

**How to apply:** `threshold = GAME_AREA.y + GAME_AREA.height - SLOT_HEIGHT - 2`. Ball X is checked against `slot.contains(ball.getX())`.

## processedBalls Set prevents double-counting

`processedBalls: Set<Ball>` tracks balls that have been scored. When a ball enters the slot area, it's added to this set immediately before processing.

**Why:** Balls can persist in the physics world for a few frames after `destroy()` is called (they're filtered out next `update()`). Without the Set, the same ball would be scored multiple times.

## Manager pattern: no Phaser dependency

All managers (Economy, AutoDropper, Combo, etc.) are pure TypeScript classes with no Phaser import. The GameScene owns all managers and wires them together.

**Why:** Enables easy unit testing and cleaner separation of game logic from rendering.

## Save format: version 4, key `idle-balls-save-v4`

If the save format changes structurally, increment the version and the key. Loading uses `?? defaultValue` for all fields to handle forward/backward compatibility.
