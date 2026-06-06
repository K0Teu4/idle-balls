import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { APShopManager, AP_UPGRADES } from "../managers/APShopManager";
import { t } from "../i18n/Strings";
import { fmt } from "../utils/NumberFormat";

export class APShopWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private infoTexts: Phaser.GameObjects.Text[] = [];
    private nextTexts: Phaser.GameObjects.Text[] = [];
    private costTexts: Phaser.GameObjects.Text[] = [];
    private buyBtns: Phaser.GameObjects.Rectangle[] = [];
    private buyBtnTexts: Phaser.GameObjects.Text[] = [];
    private visible = false;
    private apLabel!: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        apShop: APShopManager,
        onBuy: (id: string) => void
    ) {
        const d = 520;
        const pw = 680;
        const ph = 420;
        const px = 640;
        const py = 362;
        const panelLeft = px - pw / 2;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.78)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.apBg).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 20, t("title_apshop"), {
            fontFamily: "'Courier New', monospace", fontSize: "17px",
            color: UIColors.apColor, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeX = scene.add.text(px + pw / 2 - 16, py - ph / 2 + 20, "✕", {
            fontFamily: "'Courier New', monospace", fontSize: "16px", color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeX.on("pointerup", () => this.hide());

        this.apLabel = scene.add.text(px, py - ph / 2 + 40, "", {
            fontFamily: "'Courier New', monospace", fontSize: "12px", color: UIColors.apColor,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const sep = scene.add.rectangle(px, py - ph / 2 + 54, pw - 16, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        this.group.push(overlay, panel, title, closeX, this.apLabel, sep);

        // ── 2-column grid layout ──────────────────────────────────────
        const contentTop = py - ph / 2 + 62;
        const iw = 316;
        const itemH = 86;
        const gap = 4;
        const col1 = panelLeft + 10;
        const col2 = col1 + iw + 8;

        AP_UPGRADES.forEach((upg, i) => {
            const col = i % 2 === 0 ? col1 : col2;
            const row = Math.floor(i / 2);
            const ay = contentTop + row * (itemH + gap);
            const tw = iw - 72; // text area width (leave room for buy button)

            const bg = scene.add.rectangle(col + iw / 2, ay + itemH / 2, iw, itemH, UIColors.panelAlt)
                .setDepth(d + 1).setStrokeStyle(1, UIColors.panelBorder).setVisible(false);
            this.group.push(bg);

            const nameT = scene.add.text(col + 6, ay + 5, upg.title, {
                fontFamily: "'Courier New', monospace", fontSize: "12px",
                color: UIColors.apColor, fontStyle: "bold",
                wordWrap: { width: tw },
            }).setDepth(d + 2).setVisible(false);
            this.group.push(nameT);

            const descT = scene.add.text(col + 6, ay + 21, upg.description, {
                fontFamily: "'Courier New', monospace", fontSize: "10px",
                color: UIColors.textDim,
                wordWrap: { width: tw },
            }).setDepth(d + 2).setVisible(false);
            this.group.push(descT);

            const infoT = scene.add.text(col + 6, ay + 38, "", {
                fontFamily: "'Courier New', monospace", fontSize: "11px",
                color: UIColors.rate,
                wordWrap: { width: tw },
            }).setDepth(d + 2).setVisible(false);
            this.infoTexts.push(infoT);
            this.group.push(infoT);

            const nextT = scene.add.text(col + 6, ay + 53, "", {
                fontFamily: "'Courier New', monospace", fontSize: "10px",
                color: UIColors.textDim,
                wordWrap: { width: tw },
            }).setDepth(d + 2).setVisible(false);
            this.nextTexts.push(nextT);
            this.group.push(nextT);

            const costT = scene.add.text(col + 6, ay + 68, "", {
                fontFamily: "'Courier New', monospace", fontSize: "10px",
                color: UIColors.apColor,
                wordWrap: { width: tw },
            }).setDepth(d + 2).setVisible(false);
            this.costTexts.push(costT);
            this.group.push(costT);

            const bx = col + iw - 32;
            const buyBtn = scene.add.rectangle(bx, ay + itemH / 2, 56, 28, UIColors.buttonPurple)
                .setDepth(d + 2).setStrokeStyle(1, 0x7744cc).setVisible(false)
                .setInteractive({ useHandCursor: true });
            const buyBtnT = scene.add.text(bx, ay + itemH / 2, t("buy"), {
                fontFamily: "'Courier New', monospace", fontSize: "11px",
                color: "#fff", fontStyle: "bold",
            }).setOrigin(0.5).setDepth(d + 3).setVisible(false);

            buyBtn.on("pointerup", () => onBuy(upg.id));
            buyBtn.on("pointerover", () => buyBtn.setFillStyle(0x7744cc));
            buyBtn.on("pointerout", () => buyBtn.setFillStyle(UIColors.buttonPurple));
            this.buyBtns.push(buyBtn);
            this.buyBtnTexts.push(buyBtnT);
            this.group.push(buyBtn, buyBtnT);
        });

        const hint = scene.add.text(px, py + ph / 2 - 12, "AP earned from Achievements  •  upgrades scale infinitely", {
            fontFamily: "'Courier New', monospace", fontSize: "10px", color: UIColors.textDim,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);
        this.group.push(hint);
    }

    show(apShop: APShopManager, availableAP: number): void {
        this._refresh(apShop, availableAP);
        this.setVisible(true);
    }

    updateAP(availableAP: number, apShop: APShopManager): void {
        if (!this.visible) return;
        this._refresh(apShop, availableAP);
    }

    private _refresh(apShop: APShopManager, availableAP: number): void {
        this.apLabel.setText(`AP Available: ${fmt(availableAP)}`);
        AP_UPGRADES.forEach((upg, i) => {
            const lv = apShop.getLevel(upg.id);
            const cost = apShop.getCost(upg.id);
            const can = availableAP >= cost;

            this.infoTexts[i].setText(`Lv ${lv}  →  ${upg.effectLine(lv)}`);
            const nextEffect = upg.effectLine(lv + 1);
            this.nextTexts[i].setText(nextEffect !== upg.effectLine(lv) ? `Next: ${nextEffect}` : "");
            this.costTexts[i].setText(`Cost: ${cost} AP`);
            this.buyBtns[i].setFillStyle(can ? UIColors.buttonPurple : 0x2a2a2a);
            this.buyBtnTexts[i].setColor(can ? "#ffffff" : "#555555");
            this.buyBtnTexts[i].setText(t("buy"));
        });
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
