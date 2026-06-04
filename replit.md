# Idle Balls

A full-featured idle/incremental Plinko-style game built with Phaser 4 + TypeScript + Vite. Balls fall through a peg board into slots earning money, which is spent on upgrades for automation, multipliers, and special abilities.

## Run & Operate

- `pnpm --filter @workspace/idle-balls run dev` — run the game (port 22341, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Game: Phaser 4.1.0 + Matter.js physics
- Frontend: React (thin wrapper) + Vite
- No backend required for game; API server separate

## Where things live

- `artifacts/idle-balls/src/game/scenes/GameScene.ts` — main game scene (source of truth)
- `artifacts/idle-balls/src/game/config/GameConfig.ts` — board layout, physics constants
- `artifacts/idle-balls/src/game/config/EconomyConfig.ts` — upgrade costs
- `artifacts/idle-balls/src/game/config/AchievementConfig.ts` — achievement definitions
- `artifacts/idle-balls/src/game/managers/SaveManager.ts` — save/load (localStorage, key `idle-balls-save-v4`)
- `artifacts/idle-balls/src/App.tsx` — Phaser game init (React wrapper)

## Architecture decisions

- Phaser 4 + Matter.js for physics; React is just a mount container
- Slot hit detection via Y-threshold (not collision), not physics bottom wall
- Balls marked in `processedBalls: Set<Ball>` to prevent double-counting
- All managers are plain TypeScript classes (no Phaser dependency) — easy to test
- Save data version 4 (`idle-balls-save-v4`), auto-saved every 5s and on page unload
- Gravity: `{ x: 0, y: 1.5 }` (Phaser 4 requires both x and y in Vector2Like)

## Product

- **Drop Phase**: Click or press Space to drop a ball; ball costs money
- **Earn Phase**: Ball bounces off 8 rows of pegs, lands in one of 7 slots (x1, x2, x5, x10, x5, x2, x1)
- **Shop (6 upgrades)**: Auto Dropper, Multiplier, Ball Capacity, Golden Ball, Lucky Peg, Speed
- **AP System**: Achievement Points earned from milestones; spent in AP Shop (4 upgrades)
- **Combo System**: Hit slots in quick succession for up to +80%+ income bonus
- **Lucky Peg**: Random bonus money on peg hit
- **Golden Balls**: 5× reward multiplier; triggered by Golden Ball upgrade chance
- **Daily Bonus**: Streak-based daily reward (up to ×4 at 7-day streak)
- **Achievements**: 9 categories × 5 milestones each; grant AP
- **Offline Earnings**: Up to 8h of auto-drop income calculated on return
- **Statistics**: Detailed lifetime and session tracking window

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Phaser 4 gravity needs `{ x: 0, y: N }` not just `{ y: N }` — `Vector2Like` requires both
- `Slot.flash()` tweens `fillColor` property directly on Rectangle — works in Phaser 4
- Ball physics bodies labeled `"ball"`, peg bodies labeled `"peg"`, walls labeled `"wall"/"divider"`
- `pnpm run dev` at root doesn't work — use workflow or `pnpm --filter` with specific package

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
