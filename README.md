# Idle Balls

Idle Plinko on **Phaser 4** + **Matter.js** + **Vite**.

## Run

```bash
npm install
npm run dev
```

## What's new (balance & UX pass)

- **Softer shop prices** (auto-dropper ~1.58× instead of 2× per level).
- **Soft caps with over-level bonuses**: Lucky Peg / Speed / AP Discount & Golden keep giving value after their “main” cap.
- **Combo fixed**: bonus capped at 15 stacks; HUD shows real % (no more ×139 / +828%).
- **AP Shop**: new **Combo Mastery** (longer window + bigger combo cap); unlimited levels on all AP upgrades.
- **Scrollable shop** (mouse wheel over the right column).
- **Statistics panel**: two columns + activity bar (no broken text).
- **Achievements panel**: wider cards, mask scroll, clearer spacing.
- **Background progress**: returning to the tab simulates auto-drop income (up to 8h).
- **Layout**: dark page background, scaled canvas, right shop column on dark panel (no white strip).

## Controls

| Key / UI | Action |
|----------|--------|
| **Space** | Drop ball |
| **Esc** | Close overlays |
| **Daily** | Claim daily streak bonus |
| Shop wheel | Scroll upgrades |

Save: `localStorage` → `idle-balls-save` (migrates to v6).
