export type Language = "en" | "ru";
export type Theme = "dark" | "night" | "warm" | "retro";
export type FontSize = "small" | "medium" | "large";
export type AnimSpeed = "slow" | "normal" | "fast";

export interface Settings {
    language: Language;
    theme: Theme;
    fontSize: FontSize;
    animSpeed: AnimSpeed;
    showFPS: boolean;
    autosaveSec: number;
    showFloatingText: boolean;
    showComboNumbers: boolean;
}

const KEY = "idle-balls-settings-v1";

const DEFAULTS: Settings = {
    language: "en",
    theme: "dark",
    fontSize: "medium",
    animSpeed: "normal",
    showFPS: false,
    autosaveSec: 5,
    showFloatingText: true,
    showComboNumbers: true,
};

let _current: Settings = _loadFromStorage();

function _loadFromStorage(): Settings {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { ...DEFAULTS };
        return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
        return { ...DEFAULTS };
    }
}

export class SettingsManager {
    static get(): Settings { return _current; }
    static getLanguage(): Language { return _current.language; }
    static getTheme(): Theme { return _current.theme; }
    static getFontSize(): FontSize { return _current.fontSize; }
    static getAnimSpeed(): AnimSpeed { return _current.animSpeed; }
    static showFPS(): boolean { return _current.showFPS; }
    static showFloatingText(): boolean { return _current.showFloatingText; }
    static getAutosaveSec(): number { return _current.autosaveSec; }

    static set(partial: Partial<Settings>): void {
        _current = { ..._current, ...partial };
        try {
            localStorage.setItem(KEY, JSON.stringify(_current));
        } catch { }
    }

    static resetToDefaults(): void {
        _current = { ...DEFAULTS };
        try {
            localStorage.setItem(KEY, JSON.stringify(_current));
        } catch { }
    }
}
