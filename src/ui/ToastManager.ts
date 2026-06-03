import Phaser from "phaser";

interface ToastEntry {

    text: Phaser.GameObjects.Text;

    expiresAt: number;
}

export class ToastManager {

    private readonly scene: Phaser.Scene;

    private readonly toasts: ToastEntry[] = [];

    private readonly baseY = 48;

    constructor(scene: Phaser.Scene) {

        this.scene = scene;
    }

    show(
        message: string,
        color = "#ffffff",
        durationMs = 2200
    ): void {

        const text =
            this.scene.add.text(
                this.scene.scale.width / 2,
                this.baseY,
                message,
                {
                    fontSize: "20px",
                    color,
                    backgroundColor: "#000000aa",
                    padding: {
                        left: 14,
                        right: 14,
                        top: 8,
                        bottom: 8
                    }
                }
            )
            .setOrigin(0.5)
            .setDepth(20_000);

        this.toasts.push({
            text,
            expiresAt: Date.now() + durationMs
        });

        this.layout();
    }

    update(): void {

        const now = Date.now();

        for (let i = this.toasts.length - 1; i >= 0; i--) {

            const entry = this.toasts[i]!;

            if (now < entry.expiresAt) {
                continue;
            }

            entry.text.destroy();
            this.toasts.splice(i, 1);
        }

        this.layout();
    }

    private layout(): void {

        this.toasts.forEach((entry, index) => {

            entry.text.y =
                this.baseY + index * 42;
        });
    }
}
