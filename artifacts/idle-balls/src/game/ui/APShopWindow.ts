import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { APShopManager, AP_UPGRADES } from "../managers/APShopManager";
import { fmt } from "../utils/NumberFormat";

export class APShopWindow {
    private group: Phaser.GameObjects.GameObject[] = [];
    private infoTexts: Phaser.GameObjects.Text[] = [];
    private costTexts: Phaser.GameObjects.Text[] = [];
    private buyBtns: Phaser.GameObjects.Rectangle[] = [];
    private visible = false;
    private apLabel!: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        apShop: APShopManager,
        onBuy: (id: string) => void
    ) {
        const d = 520;
        const pw = 580;
        const ph = 500;
        const px = 640;
        const py = 360;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, UIColors.panelBorder).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 22, "AP SHOP", {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: UIColors.apColor,
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeBtn = scene.add.text(px + pw / 2 - 18, py - ph / 2 + 22, "✕", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeBtn.on("pointerup", () => this.hide());

        this.apLabel = scene.add.text(px, py - ph / 2 + 46, "", {
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            color: UIColors.apColor,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const sep = scene.add.rectangle(px, py - ph / 2 + 56, pw - 20, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);

        this.group = [overlay, panel, title, closeBtn, this.apLabel, sep];

        const top = py - ph / 2 + 68;
        const itemH = 96;
        const itemW = pw - 30;
        const ix = px - pw / 2 + 15;

        AP_UPGRADES.forEach((upg, i) => {
            const ay = top + i * (itemH + 4);
            const bg = scene.add.rectangle(px, ay + itemH / 2, itemW, itemH, UIColors.panelAlt)
                .setDepth(d + 1).setStrokeStyle(1, UIColors.panelBorder).setVisible(false);
            this.group.push(bg);

            const nameT = scene.add.text(ix, ay + 6, upg.title, {
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                color: UIColors.apColor,
                fontStyle: "bold",
            }).setDepth(d + 2).setVisible(false);
            this.group.push(nameT);

            const descT = scene.add.text(ix, ay + 26, upg.description, {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: UIColors.textDim,
            }).setDepth(d + 2).setVisible(false);
            this.group.push(descT);

            const infoT = scene.add.text(ix, ay + 46, "", {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: UIColors.rate,
            }).setDepth(d + 2).setVisible(false);
            this.infoTexts.push(infoT);
            this.group.push(infoT);

            const costT = scene.add.text(ix, ay + 66, "", {
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: UIColors.apColor,
            }).setDepth(d + 2).setVisible(false);
            this.costTexts.push(costT);
            this.group.push(costT);

            const buyBtn = scene.add.rectangle(ix + itemW - 50, ay + itemH / 2, 68, 28, UIColors.buttonPurple)
                .setDepth(d + 2).setStrokeStyle(1, 0x6633aa).setVisible(false)
                .setInteractive({ useHandCursor: true });
            const buyBtnT = scene.add.text(ix + itemW - 50, ay + itemH / 2, "BUY", {
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                color: "#ffffff",
                fontStyle: "bold",
            }).setOrigin(0.5).setDepth(d + 3).setVisible(false);

            buyBtn.on("pointerup", () => onBuy(upg.id));
            buyBtn.on("pointerover", () => buyBtn.setFillStyle(0x7744cc));
            buyBtn.on("pointerout", () => buyBtn.setFillStyle(UIColors.buttonPurple));

            this.buyBtns.push(buyBtn);
            this.group.push(buyBtn, buyBtnT);
        });
    }

    show(apShop: APShopManager, availableAP: number): void {
        this.apLabel.setText(`Available AP: ${fmt(availableAP)}`);
        AP_UPGRADES.forEach((upg, i) => {
            const lv = apShop.getLevel(upg.id);
            const cost = apShop.getCost(upg.id);
            const can = availableAP >= cost;
            this.infoTexts[i].setText(`Level ${lv}  •  ${upg.effectLine(lv)}`);
            this.costTexts[i].setText(`Cost: ${cost} AP`);
            this.buyBtns[i].setFillStyle(can ? UIColors.buttonPurple : 0x2a2a2a);
        });
        this.setVisible(true);
    }

    updateAP(availableAP: number, apShop: APShopManager): void {
        if (!this.visible) return;
        this.apLabel.setText(`Available AP: ${fmt(availableAP)}`);
        AP_UPGRADES.forEach((upg, i) => {
            const lv = apShop.getLevel(upg.id);
            const cost = apShop.getCost(upg.id);
            const can = availableAP >= cost;
            this.infoTexts[i].setText(`Level ${lv}  •  ${upg.effectLine(lv)}`);
            this.costTexts[i].setText(`Cost: ${cost} AP`);
            this.buyBtns[i].setFillStyle(can ? UIColors.buttonPurple : 0x2a2a2a);
        });
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.group) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
