import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { AchievementState } from "../managers/AchievementManager";
import { fmt } from "../utils/NumberFormat";

export class AchievementsWindow {
    private baseGroup: Phaser.GameObjects.GameObject[] = [];
    private pageItems: Phaser.GameObjects.GameObject[] = [];
    private visible = false;
    private scene: Phaser.Scene;
    private page = 0;
    private states: AchievementState[] = [];
    private totalAP = 0;
    private readonly PER_PAGE = 5;
    private readonly D = 520;
    private readonly PW = 640;
    private readonly PH = 560;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        const d = this.D;
        const pw = this.PW;
        const ph = this.PH;
        const px = 640;
        const py = 360;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 22, "ACHIEVEMENTS", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.textGold,
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeBtn = scene.add.text(px + pw / 2 - 18, py - ph / 2 + 22, "✕", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeBtn.on("pointerup", () => this.hide());

        const sep = scene.add.rectangle(px, py - ph / 2 + 40, pw - 20, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        this.baseGroup = [overlay, panel, title, closeBtn, sep];
    }

    show(states: AchievementState[], totalAP: number): void {
        this.states = states;
        this.totalAP = totalAP;
        this.page = 0;
        this.renderPage();
        this.setBaseVisible(true);
    }

    hide(): void {
        this.setBaseVisible(false);
        this.clearPage();
    }

    private clearPage(): void {
        for (const obj of this.pageItems) (obj as Phaser.GameObjects.GameObject & { destroy: () => void }).destroy();
        this.pageItems = [];
    }

    private renderPage(): void {
        this.clearPage();
        const scene = this.scene;
        const d = this.D + 1;
        const pw = this.PW;
        const ph = this.PH;
        const px = 640;
        const py = 360;
        const top = py - ph / 2 + 48;
        const start = this.page * this.PER_PAGE;
        const items = this.states.slice(start, start + this.PER_PAGE);

        const apLabel = scene.add.text(px, top - 8, `Total AP earned: ${fmt(this.totalAP)}`, {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.apColor,
        }).setOrigin(0.5).setDepth(d).setVisible(this.visible);
        this.pageItems.push(apLabel);

        items.forEach((state, i) => {
            const ay = top + 30 + i * 88;
            const aLeft = px - pw / 2 + 20;
            const aW = pw - 40;

            const bg = scene.add.rectangle(px, ay + 34, aW, 82, UIColors.panelAlt)
                .setDepth(d).setStrokeStyle(1, UIColors.panelBorder).setVisible(this.visible);
            this.pageItems.push(bg);

            const ms = state.currentMilestone;
            const maxMs = state.def.milestones.length;
            const levelStr = ms >= maxMs ? `★ MAX (${ms}/${maxMs})` : `Lv ${ms}/${maxMs}`;
            const nextMs = ms < maxMs ? state.def.milestones[ms] : null;
            const apReward = nextMs ? `+${nextMs.ap} AP` : "Completed!";

            const nameT = scene.add.text(aLeft, ay + 8, `${state.def.title}`, {
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                color: ms >= maxMs ? UIColors.textGold : UIColors.text,
                fontStyle: "bold",
            }).setDepth(d + 1).setVisible(this.visible);
            this.pageItems.push(nameT);

            const lvT = scene.add.text(aLeft + aW - 4, ay + 8, levelStr, {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: UIColors.apColor,
            }).setOrigin(1, 0).setDepth(d + 1).setVisible(this.visible);
            this.pageItems.push(lvT);

            const descT = scene.add.text(aLeft, ay + 28, state.def.description, {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: UIColors.textDim,
            }).setDepth(d + 1).setVisible(this.visible);
            this.pageItems.push(descT);

            const progT = nextMs
                ? `${fmt(state.current)} / ${fmt(nextMs.target)}  (${apReward})`
                : "All milestones completed!";
            const pT = scene.add.text(aLeft, ay + 48, progT, {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: nextMs ? UIColors.rate : UIColors.textGold,
            }).setDepth(d + 1).setVisible(this.visible);
            this.pageItems.push(pT);

            if (nextMs) {
                const barW = aW - 4;
                const frac = Math.min(state.current / nextMs.target, 1);
                const bgBar = scene.add.rectangle(aLeft + barW / 2, ay + 68, barW, 8, 0x223344)
                    .setDepth(d + 1).setVisible(this.visible);
                this.pageItems.push(bgBar);
                if (frac > 0) {
                    const fillBar = scene.add.rectangle(aLeft, ay + 68, Math.floor(barW * frac), 8, 0x3388ff)
                        .setOrigin(0, 0.5).setDepth(d + 2).setVisible(this.visible);
                    this.pageItems.push(fillBar);
                }
            }
        });

        const totalPages = Math.ceil(this.states.length / this.PER_PAGE);
        const pageLabel = scene.add.text(px, py + ph / 2 - 24, `Page ${this.page + 1} / ${totalPages}`, {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.textDim,
        }).setOrigin(0.5).setDepth(d).setVisible(this.visible);
        this.pageItems.push(pageLabel);

        if (this.page > 0) {
            const prev = scene.add.text(px - 80, py + ph / 2 - 24, "◀ Prev", {
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                color: UIColors.rate,
            }).setOrigin(0.5).setDepth(d).setVisible(this.visible).setInteractive({ useHandCursor: true });
            prev.on("pointerup", () => { this.page--; this.renderPage(); });
            this.pageItems.push(prev);
        }

        if (this.page < totalPages - 1) {
            const next = scene.add.text(px + 80, py + ph / 2 - 24, "Next ▶", {
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                color: UIColors.rate,
            }).setOrigin(0.5).setDepth(d).setVisible(this.visible).setInteractive({ useHandCursor: true });
            next.on("pointerup", () => { this.page++; this.renderPage(); });
            this.pageItems.push(next);
        }
    }

    private setBaseVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.baseGroup) (obj as any).setVisible(v);
        for (const obj of this.pageItems) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
