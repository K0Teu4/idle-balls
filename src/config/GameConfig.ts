/** Full game resolution (Phaser canvas). */
export const GAME_WIDTH = 1280;

export const GAME_HEIGHT = 720;

/** Left HUD column. */
export const HUD_WIDTH = 248;

/** Main playfield (plinko board). */
export const GAME_AREA = {
    x: HUD_WIDTH + 12,
    y: 24,
    width: 668,
    height: 672
};

/** Right shop column. */
export const SHOP_X = 948;

export const SHOP_WIDTH = 320;

export const SLOT_VALUES = [
    1,
    2,
    5,
    10,
    5,
    2,
    1
];

export const SLOT_HEIGHT = 80;
