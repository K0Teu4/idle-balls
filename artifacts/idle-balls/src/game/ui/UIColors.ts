import { SettingsManager, Theme } from "../managers/SettingsManager";

export const UIColors = {
    background: 0x101418,
    panel: 0x161c24,
    panelBorder: 0x2a3a4a,
    panelAlt: 0x1a2430,

    button: 0x1a4fa8,
    buttonHover: 0x2a6fd8,
    buttonGold: 0x8a6a00,
    buttonGreen: 0x1a7a3a,
    buttonPurple: 0x5a2a8a,

    money: "#f5c518",
    moneyNeg: "#ff6655",
    rate: "#88ccff",
    text: "#e8eaf0",
    textDim: "#7a8a9a",
    textGold: "#ffd700",

    autoDropper: "#4ea1ff",
    multiplier: "#c86cff",
    capacity: "#51d88a",
    golden: "#ffd700",
    luckyPeg: "#44ff99",
    speed: "#ff9944",
    doubleStrike: "#ff6688",
    insurance: "#44ccaa",

    comboBar: 0x3388ff,
    comboText: "#88ccff",

    apColor: "#aa88ff",
    apBg: 0x2a1a4a,

    modalBg: 0x0d1520,
    modalOverlay: 0x000000,
};

const themeOverrides: Record<Theme, Partial<typeof UIColors>> = {
    dark: {},
    night: {
        background: 0x060d18,
        panel: 0x091222,
        panelBorder: 0x1a3a60,
        panelAlt: 0x0c1830,
        button: 0x0d3a88,
        buttonHover: 0x1a5ab8,
        comboBar: 0x2266ee,
        rate: "#66aaff",
        modalBg: 0x06101c,
    },
    warm: {
        background: 0x1a0e06,
        panel: 0x221408,
        panelBorder: 0x442c0e,
        panelAlt: 0x1c1006,
        button: 0x7a3a10,
        buttonHover: 0xaa5518,
        buttonGold: 0x996600,
        comboBar: 0xcc6622,
        money: "#ffbb44",
        textGold: "#ffcc88",
        rate: "#ffaa66",
        modalBg: 0x150c06,
    },
    retro: {
        background: 0x001100,
        panel: 0x001800,
        panelBorder: 0x003300,
        panelAlt: 0x002200,
        button: 0x004400,
        buttonHover: 0x006600,
        buttonGold: 0x555500,
        buttonGreen: 0x003300,
        buttonPurple: 0x003322,
        comboBar: 0x00aa00,
        money: "#00ff44",
        text: "#00cc00",
        textDim: "#005500",
        textGold: "#00ff88",
        rate: "#00aaff",
        moneyNeg: "#ff4400",
        modalBg: 0x000d00,
    },
};

export function applyTheme(): void {
    const theme = SettingsManager.getTheme();
    const overrides = themeOverrides[theme] ?? {};
    Object.assign(UIColors, themeOverrides.dark); // reset to dark first
    Object.assign(UIColors, overrides);
}
