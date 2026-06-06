---
name: Idle Balls shop layout
description: Layout constants for HudPanel, ShopPanel, PrestigeWindow; hold-space mechanic; bank manager pattern
---

## ShopPanel
- ShopItem.H = 72, gap = 2 → slot height = 74
- 9 items fit: y = 36 + i*74, last item bottom = 36 + 8*74 + 72 = 700 < 720 ✓
- Add items to ShopUpdate interface AND ShopPanel constructor callbacks when adding new upgrades
- updateShop() in GameScene must mirror ShopUpdate interface

## HudPanel
- Key button Y positions: DROP=166, DAILY=210, STATS=239, ACHIEVE=268, AP=297, sep=332, PRESTIGE_SHOP=337, PRESTIGE_BTN=375, req_text=395, sep=410, SETTINGS=415, HELP=444
- constructor takes 9 callbacks: drop, stats, achievements, apShop, daily, prestige, settings, help
- update() takes 13 params including prestigeNeeded as last

## PrestigeWindow
- PH=640, itemH=56, gap=2 → 7 upgrades fit (upgradeTop=166, 7×58=406, ends at 572 < btn at 652)
- Dynamically renders PRESTIGE_UPGRADES array — just add to the array for new boosts

## Hold Space mechanic
- Use `spaceKey?.isDown` instead of `JustDown` — tryDropBall() has internal nextManualDrop cooldown

## Bank mechanic
- BankManager.tick(money, deltaSec) accumulates fractional interest, returns floor
- Call in update() with `delta / 1000` (delta is ms)
- 0.5% per minute per level

## setStrokeStyle type
- `setStrokeStyle(width, color)` requires color as number (0xRRGGBB), NOT string — UIColors.textGold is a string so use literal 0xffd700 instead

## PP Amplifier + Wealth Guard
- getPPAmplifierMult() multiplies basePP in doPrestige() before adding to totalPP
- getMoneyRetentionPct() used in GameScene.doPrestige() to compute moneyKept BEFORE resetting
- Bank level also reduced by retPct on prestige (like other shop upgrades)
