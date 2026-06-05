import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { SettingsManager, Language, Theme } from "../managers/SettingsManager";
import { t } from "../i18n/Strings";
import { SaveManager } from "../managers/SaveManager";

export class SettingsWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private visible = false;
    private restartMsg!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, onSettingChanged: (key: string, val: unknown) => void) {
        const d = 540;
        const pw = 580;
        const ph = 490;
        const px = 640;
        const py = 362;
        const lx = px - pw / 2 + 18;
        const rEdge = px + pw / 2 - 14;
        const iw = pw - 32;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.80)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 22, t("title_settings"), {
            fontFamily: "'Courier New', monospace", fontSize: "20px",
            color: UIColors.textGold, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeX = scene.add.text(rEdge, py - ph / 2 + 22, "✕", {
            fontFamily: "'Courier New', monospace", fontSize: "18px", color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeX.on("pointerup", () => this.hide());

        const sep0 = scene.add.rectangle(px, py - ph / 2 + 40, iw, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        let cy = py - ph / 2 + 54;

        // ─── LANGUAGE ────────────────────────────────────────────────
        const langLabel = this._sectionLabel(scene, lx, cy, t("s_language"), d);
        cy += 22;

        const langs: { key: Language; label: string }[] = [
            { key: "en", label: "English" },
            { key: "ru", label: "Русский" },
        ];
        const langBtns = langs.map((l, i) => {
            const bx = lx + i * 136;
            const btn = this._optionBtn(scene, bx, cy, 126, 26, l.label, d,
                () => {
                    SettingsManager.set({ language: l.key });
                    this.refreshBtns();
                    this.showRestartMsg(scene, px, py + ph / 2 - 56);
                    onSettingChanged("language", l.key);
                });
            return { ...btn, key: l.key };
        });
        cy += 36;

        // ─── THEME ───────────────────────────────────────────────────
        const themeLabel = this._sectionLabel(scene, lx, cy, t("s_theme"), d);
        cy += 22;

        const themes: { key: Theme; label: string; color: number }[] = [
            { key: "dark", label: "Dark", color: 0x1a2a3a },
            { key: "night", label: "Night", color: 0x061228 },
            { key: "warm", label: "Warm", color: 0x221408 },
            { key: "retro", label: "Retro", color: 0x002200 },
        ];
        const themeBtns = themes.map((th, i) => {
            const bx = lx + i * 132;
            const swatch = scene.add.rectangle(bx + 5, cy + 13, 12, 12, th.color)
                .setDepth(d + 2).setVisible(false).setStrokeStyle(1, 0x777777);
            const btn = this._optionBtn(scene, bx + 18, cy, 108, 26, th.label, d,
                () => {
                    SettingsManager.set({ theme: th.key });
                    this.refreshBtns();
                    this.showRestartMsg(scene, px, py + ph / 2 - 56);
                    onSettingChanged("theme", th.key);
                });
            this.group.push(swatch);
            return { ...btn, key: th.key };
        });
        cy += 36;

        // ─── DISPLAY ─────────────────────────────────────────────────
        const dispLabel = this._sectionLabel(scene, lx, cy, t("s_display"), d);
        cy += 22;

        this._rowLabel(scene, lx, cy + 5, t("s_float_text"), d);
        const floatBtns = this._onOffToggle(scene, rEdge - 122, cy, d,
            SettingsManager.showFloatingText(),
            (v) => { SettingsManager.set({ showFloatingText: v }); onSettingChanged("showFloatingText", v); });
        cy += 34;

        this._rowLabel(scene, lx, cy + 5, t("s_show_fps"), d);
        const fpsBtns = this._onOffToggle(scene, rEdge - 122, cy, d,
            SettingsManager.showFPS(),
            (v) => { SettingsManager.set({ showFPS: v }); onSettingChanged("showFPS", v); });
        cy += 36;

        // ─── GAMEPLAY ────────────────────────────────────────────────
        const gameLabel = this._sectionLabel(scene, lx, cy, t("s_gameplay"), d);
        cy += 22;

        this._rowLabel(scene, lx, cy + 5, t("s_autosave"), d);
        const autoBtns = [5, 15, 30].map((s, i) => {
            const bx = rEdge - 3 * 64 - 4 + i * 66;
            const btn = this._optionBtn(scene, bx, cy, 62, 26, `${s}s`, d,
                () => { SettingsManager.set({ autosaveSec: s }); this.refreshBtns(); onSettingChanged("autosaveSec", s); });
            return { ...btn, key: String(s) };
        });
        cy += 34;

        this._rowLabel(scene, lx, cy + 5, t("s_anim_speed"), d);
        const animKeys = ["slow", "normal", "fast"] as const;
        const animBtns = animKeys.map((k, i) => {
            const label = k.charAt(0).toUpperCase() + k.slice(1);
            const bx = rEdge - 3 * 76 - 4 + i * 78;
            const btn = this._optionBtn(scene, bx, cy, 74, 26, label, d,
                () => { SettingsManager.set({ animSpeed: k }); this.refreshBtns(); onSettingChanged("animSpeed", k); });
            return { ...btn, key: k };
        });
        cy += 38;

        // ─── DATA ────────────────────────────────────────────────────
        const dataSep = scene.add.rectangle(px, cy, iw, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);
        cy += 12;

        scene.add.text(lx, cy, `Save: idle-balls-save-v4`, {
            fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.textDim,
        }).setDepth(d + 1).setVisible(false); // static, always visible when panel is

        const clearBtn = scene.add.rectangle(rEdge - 75, cy + 7, 128, 24, 0x5a1010)
            .setDepth(d + 1).setStrokeStyle(1, 0xaa2222).setVisible(false)
            .setInteractive({ useHandCursor: true });
        const clearT = scene.add.text(rEdge - 75, cy + 7, t("s_clear_save"), {
            fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#ff6655", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        clearBtn.on("pointerup", () => {
            SaveManager.clear();
            window.location.reload();
        });
        cy += 30;

        // ─── RESTART MESSAGE ─────────────────────────────────────────
        this.restartMsg = scene.add.text(px, py + ph / 2 - 56, "", {
            fontFamily: "'Courier New', monospace", fontSize: "11px",
            color: "#ffcc44", align: "center",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);

        // ─── FOOTER ──────────────────────────────────────────────────
        const closeBtn = scene.add.rectangle(px - 80, py + ph / 2 - 26, 130, 32, 0x333344)
            .setDepth(d + 1).setStrokeStyle(1, UIColors.panelBorder).setVisible(false)
            .setInteractive({ useHandCursor: true });
        const closeBtnT = scene.add.text(px - 80, py + ph / 2 - 26, t("s_close"), {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#cccccc", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        closeBtn.on("pointerup", () => this.hide());

        const restartBtn = scene.add.rectangle(px + 80, py + ph / 2 - 26, 156, 32, 0x225500)
            .setDepth(d + 1).setStrokeStyle(1, 0x448800).setVisible(false)
            .setInteractive({ useHandCursor: true });
        const restartBtnT = scene.add.text(px + 80, py + ph / 2 - 26, t("s_restart"), {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#aaffaa", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        restartBtn.on("pointerup", () => window.location.reload());

        this.group.push(
            overlay, panel, title, closeX, sep0,
            langLabel, themeLabel, dispLabel, gameLabel,
            dataSep, clearBtn, clearT, this.restartMsg,
            closeBtn, closeBtnT, restartBtn, restartBtnT,
            ...floatBtns.flatMap(b => [b.bg, b.txt]),
            ...fpsBtns.flatMap(b => [b.bg, b.txt]),
            ...langBtns.flatMap(b => [b.bg, b.txt]),
            ...themeBtns.flatMap(b => [b.bg, b.txt]),
            ...autoBtns.flatMap(b => [b.bg, b.txt]),
            ...animBtns.flatMap(b => [b.bg, b.txt]),
        );

        // Store all toggle groups for refresh
        (this as any)._langBtns = langBtns;
        (this as any)._themeBtns = themeBtns;
        (this as any)._autoBtns = autoBtns;
        (this as any)._animBtns = animBtns;
        (this as any)._floatBtns = floatBtns;
        (this as any)._fpsBtns = fpsBtns;

        this.refreshBtns();
    }

    private showRestartMsg(scene: Phaser.Scene, x: number, y: number): void {
        this.restartMsg.setPosition(x, y);
        this.restartMsg.setText("⚠ Press RESTART GAME to apply changes");
        this.restartMsg.setAlpha(1);
    }

    private refreshBtns(): void {
        const s = SettingsManager.get();

        this._refreshGroup((this as any)._langBtns, (b: any) => b.key === s.language);
        this._refreshGroup((this as any)._themeBtns, (b: any) => b.key === s.theme);
        this._refreshGroup((this as any)._autoBtns, (b: any) => b.key === String(s.autosaveSec));
        this._refreshGroup((this as any)._animBtns, (b: any) => b.key === s.animSpeed);

        const showFloat = s.showFloatingText;
        (this as any)._floatBtns[0].bg.setFillStyle(showFloat ? 0x226622 : 0x222222);
        (this as any)._floatBtns[1].bg.setFillStyle(!showFloat ? 0x662222 : 0x222222);
        const showFps = s.showFPS;
        (this as any)._fpsBtns[0].bg.setFillStyle(showFps ? 0x226622 : 0x222222);
        (this as any)._fpsBtns[1].bg.setFillStyle(!showFps ? 0x662222 : 0x222222);
    }

    private _refreshGroup(btns: any[], isSelected: (b: any) => boolean): void {
        for (const b of btns) {
            b.bg.setFillStyle(isSelected(b) ? 0x336633 : 0x222222);
            b.bg.setStrokeStyle(1, isSelected(b) ? 0x88ff88 : UIColors.panelBorder);
        }
    }

    private _sectionLabel(scene: Phaser.Scene, x: number, y: number, label: string, d: number): Phaser.GameObjects.Text {
        return scene.add.text(x, y, `── ${label} ──`, {
            fontFamily: "'Courier New', monospace", fontSize: "11px",
            color: UIColors.textDim,
        }).setDepth(d + 1).setVisible(false);
    }

    private _rowLabel(scene: Phaser.Scene, x: number, y: number, label: string, d: number): Phaser.GameObjects.Text {
        const txt = scene.add.text(x, y, label, {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.text,
        }).setDepth(d + 1).setVisible(false);
        this.group.push(txt);
        return txt;
    }

    private _optionBtn(
        scene: Phaser.Scene, x: number, y: number, w: number, h: number,
        label: string, d: number, onClick: () => void
    ): { bg: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text; key?: string } {
        const bg = scene.add.rectangle(x + w / 2, y + h / 2, w, h, 0x222222)
            .setDepth(d + 1).setStrokeStyle(1, UIColors.panelBorder).setVisible(false)
            .setInteractive({ useHandCursor: true });
        const txt = scene.add.text(x + w / 2, y + h / 2, label, {
            fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.text,
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        bg.on("pointerup", onClick);
        bg.on("pointerover", () => bg.setAlpha(0.85));
        bg.on("pointerout", () => bg.setAlpha(1));
        return { bg, txt };
    }

    private _onOffToggle(
        scene: Phaser.Scene, x: number, y: number, d: number,
        initialValue: boolean,
        onChange: (v: boolean) => void
    ): { bg: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text }[] {
        const on = this._optionBtn(scene, x, y, 58, 26, t("s_on"), d, () => {
            onChange(true);
            on.bg.setFillStyle(0x226622);
            off.bg.setFillStyle(0x222222);
        });
        const off = this._optionBtn(scene, x + 62, y, 58, 26, t("s_off"), d, () => {
            onChange(false);
            on.bg.setFillStyle(0x222222);
            off.bg.setFillStyle(0x662222);
        });
        on.bg.setFillStyle(initialValue ? 0x226622 : 0x222222);
        off.bg.setFillStyle(!initialValue ? 0x662222 : 0x222222);
        return [on, off];
    }

    show(): void { this.refreshBtns(); this.setVisible(true); }
    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
