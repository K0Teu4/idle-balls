import Phaser from "phaser";
import { UIColors } from "./UIColors";
import { PrestigeManager, PRESTIGE_UPGRADES } from "../managers/PrestigeManager";
import { fmt } from "../utils/NumberFormat";

export class PrestigeWindow {
    private baseGroup: Phaser.GameObjects.GameObject[] = [];
    private dynamicGroup: Phaser.GameObjects.GameObject[] = [];
    private visible = false;
    private scene: Phaser.Scene;
    private prestige: PrestigeManager;
    private onPrestige: () => void;

    private statusText!: Phaser.GameObjects.Text;
    private ppText!: Phaser.GameObjects.Text;
    private reqText!: Phaser.GameObjects.Text;
    private previewText!: Phaser.GameObjects.Text;
    private prestigeBtn!: Phaser.GameObjects.Rectangle;
    private prestigeBtnText!: Phaser.GameObjects.Text;
    private upgradeInfoTexts: Phaser.GameObjects.Text[] = [];
    private upgradeCostTexts: Phaser.GameObjects.Text[] = [];
    private upgradeBuyBtns: Phaser.GameObjects.Rectangle[] = [];

    private readonly D = 520;
    private readonly PW = 600;
    private readonly PH = 580;

    constructor(scene: Phaser.Scene, prestige: PrestigeManager, onPrestige: () => void) {
        this.scene = scene;
        this.prestige = prestige;
        this.onPrestige = onPrestige;

        const d = this.D;
        const pw = this.PW;
        const ph = this.PH;
        const px = 640;
        const py = 360;

        const overlay = scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.78)
            .setDepth(d - 1).setVisible(false).setInteractive();
        overlay.on("pointerup", () => this.hide());

        const panel = scene.add.rectangle(px, py, pw, ph, UIColors.modalBg)
            .setDepth(d).setStrokeStyle(2, 0x553311).setVisible(false);

        const title = scene.add.text(px, py - ph / 2 + 22, "✦ PRESTIGE ✦", {
            fontFamily: "'Courier New', monospace",
            fontSize: "20px",
            color: "#ff9944",
            fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const closeBtn = scene.add.text(px + pw / 2 - 18, py - ph / 2 + 22, "✕", {
            fontFamily: "'Courier New', monospace",
            fontSize: "18px",
            color: UIColors.moneyNeg,
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false).setInteractive({ useHandCursor: true });
        closeBtn.on("pointerup", () => this.hide());

        const sep = scene.add.rectangle(px, py - ph / 2 + 40, pw - 20, 1, 0x553311)
            .setDepth(d + 1).setVisible(false);

        const infoY = py - ph / 2 + 56;
        this.statusText = scene.add.text(px - pw / 2 + 16, infoY, "", {
            fontFamily: "'Courier New', monospace", fontSize: "14px", color: "#ff9944",
        }).setDepth(d + 1).setVisible(false);
        this.ppText = scene.add.text(px - pw / 2 + 16, infoY + 18, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.apColor,
        }).setDepth(d + 1).setVisible(false);
        this.reqText = scene.add.text(px - pw / 2 + 16, infoY + 36, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.textDim,
        }).setDepth(d + 1).setVisible(false);
        this.previewText = scene.add.text(px - pw / 2 + 16, infoY + 54, "", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: UIColors.textGold,
        }).setDepth(d + 1).setVisible(false);

        const sep2 = scene.add.rectangle(px, py - ph / 2 + 128, pw - 20, 1, UIColors.panelBorder)
            .setDepth(d + 1).setVisible(false);
        const shopTitle = scene.add.text(px, py - ph / 2 + 142, "PRESTIGE SHOP", {
            fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#ff9944", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 1).setVisible(false);

        const upgradeTop = py - ph / 2 + 156;
        const itemH = 66;
        const ix = px - pw / 2 + 14;
        const iw = pw - 28;

        PRESTIGE_UPGRADES.forEach((upg, i) => {
            const ay = upgradeTop + i * (itemH + 3);

            const bg = scene.add.rectangle(px, ay + itemH / 2, iw, itemH, UIColors.panelAlt)
                .setDepth(d + 1).setStrokeStyle(1, 0x443322).setVisible(false);
            this.baseGroup.push(bg);

            const nameT = scene.add.text(ix, ay + 5, upg.title, {
                fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#ff9944", fontStyle: "bold",
            }).setDepth(d + 2).setVisible(false);
            this.baseGroup.push(nameT);

            const descT = scene.add.text(ix, ay + 22, upg.description, {
                fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.textDim,
            }).setDepth(d + 2).setVisible(false);
            this.baseGroup.push(descT);

            const infoT = scene.add.text(ix, ay + 38, "", {
                fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.rate,
            }).setDepth(d + 2).setVisible(false);
            this.upgradeInfoTexts.push(infoT);
            this.baseGroup.push(infoT);

            const costT = scene.add.text(ix, ay + 52, "", {
                fontFamily: "'Courier New', monospace", fontSize: "11px", color: UIColors.apColor,
            }).setDepth(d + 2).setVisible(false);
            this.upgradeCostTexts.push(costT);
            this.baseGroup.push(costT);

            const buyBtn = scene.add.rectangle(ix + iw - 44, ay + itemH / 2, 62, 26, 0x7a4400)
                .setDepth(d + 2).setStrokeStyle(1, 0xaa6600).setVisible(false)
                .setInteractive({ useHandCursor: true });
            const buyBtnT = scene.add.text(ix + iw - 44, ay + itemH / 2, "BUY", {
                fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#ffffff", fontStyle: "bold",
            }).setOrigin(0.5).setDepth(d + 3).setVisible(false);
            buyBtn.on("pointerup", () => this.onBuyUpgrade(upg.id));
            buyBtn.on("pointerover", () => buyBtn.setFillStyle(0xaa5500));
            buyBtn.on("pointerout", () => buyBtn.setFillStyle(0x7a4400));
            this.upgradeBuyBtns.push(buyBtn);
            this.baseGroup.push(buyBtn, buyBtnT);
        });

        const btnY = py + ph / 2 - 28;
        this.prestigeBtn = scene.add.rectangle(px, btnY, 220, 40, 0xcc5500)
            .setDepth(d + 1).setStrokeStyle(2, 0xff8800).setVisible(false)
            .setInteractive({ useHandCursor: true });
        this.prestigeBtnText = scene.add.text(px, btnY, "PRESTIGE NOW", {
            fontFamily: "'Courier New', monospace", fontSize: "16px", color: "#ffffff", fontStyle: "bold",
        }).setOrigin(0.5).setDepth(d + 2).setVisible(false);
        this.prestigeBtn.on("pointerup", () => { this.onPrestige(); this.hide(); });
        this.prestigeBtn.on("pointerover", () => this.prestigeBtn.setFillStyle(0xff6600));
        this.prestigeBtn.on("pointerout", () => this.prestigeBtn.setFillStyle(0xcc5500));

        this.baseGroup.push(
            overlay, panel, title, closeBtn, sep, this.statusText, this.ppText,
            this.reqText, this.previewText, sep2, shopTitle, this.prestigeBtn, this.prestigeBtnText
        );
    }

    private onBuyUpgrade(id: string): void {
        if (this.prestige.buyUpgrade(id)) {
            this.refreshContent(0);
        }
    }

    show(money: number): void {
        this.refreshContent(money);
        this.setVisible(true);
    }

    refreshContent(money: number): void {
        const count = this.prestige.getCount();
        const pp = this.prestige.getAvailablePP();
        const total = this.prestige.getTotalPP();
        const req = this.prestige.getRequirement();
        const preview = this.prestige.getPreviewPP(money);
        const can = this.prestige.canPrestige(money);

        this.statusText.setText(`Prestige #${count}   (${count === 0 ? "first ever!" : "keep going!"})`);
        this.ppText.setText(`PP: ${pp} available  (${total} total earned)`);
        this.reqText.setText(`Requirement: ${fmt(req)}   You have: ${fmt(money)}`);
        this.previewText.setText(can
            ? `✓ READY — will earn ${preview} PP on prestige`
            : `Need ${fmt(req - money)} more to prestige (would earn ${preview} PP)`);

        PRESTIGE_UPGRADES.forEach((upg, i) => {
            const lv = this.prestige.getLevel(upg.id);
            const cost = this.prestige.getCost(upg.id);
            const maxed = lv >= upg.maxLevel;
            const canAfford = pp >= cost && !maxed;
            this.upgradeInfoTexts[i].setText(`Lv ${lv}${maxed ? " (MAX)" : ""}  •  ${upg.effectLine(lv)}`);
            this.upgradeCostTexts[i].setText(maxed ? "Maxed!" : `Cost: ${cost} PP`);
            this.upgradeBuyBtns[i].setFillStyle(canAfford ? 0x7a4400 : 0x2a2a2a);
        });

        this.prestigeBtn.setFillStyle(can ? 0xcc5500 : 0x333333);
        this.prestigeBtnText.setColor(can ? "#ffffff" : "#666666");
    }

    hide(): void { this.setVisible(false); }

    private setVisible(v: boolean): void {
        this.visible = v;
        for (const obj of this.baseGroup) (obj as any).setVisible(v);
    }

    isVisible(): boolean { return this.visible; }
}
