import Phaser from "phaser";

export class StatisticsWindow {

    private container:
        Phaser.GameObjects.Container;

    private text:
        Phaser.GameObjects.Text;

    private currentContent =
        "";

    constructor(
        scene: Phaser.Scene
    ) {

        const overlay =
            scene.add.rectangle(
                640,
                360,
                2000,
                2000,
                0x000000,
                0.55
            );

        const background =
            scene.add.rectangle(
                640,
                360,
                520,
                380,
                0x222222
            )
            .setStrokeStyle(
                2,
                0x666666
            );

        const title =
            scene.add.text(
                640,
                205,
                "STATISTICS",
                {
                    fontSize: "28px",
                    color: "#ffffff"
                }
            )
            .setOrigin(0.5);

        this.text =
            scene.add.text(
                640,
                250,
                "",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    align: "center"
                }
            )
            .setOrigin(
                0.5,
                0
            );

        const closeButton =
            scene.add.text(
                875,
                190,
                "✕",
                {
                    fontSize: "32px",
                    color: "#ff6666"
                }
            )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            });

        closeButton.on(
            "pointerup",
            () => {

                this.hide();
            }
        );

        this.container =
            scene.add.container(
                0,
                0,
                [
                    overlay,
                    background,
                    title,
                    this.text,
                    closeButton
                ]
            );

        this.container
            .setDepth(10000)
            .setVisible(false);
    }

    show(
        content: string
    ): void {

        this.currentContent =
            content;

        this.text.setText(
            content
        );

        this.container.setVisible(
            true
        );
    }

    updateContent(
        content: string
    ): void {

        this.currentContent =
            content;

        if (
            this.container.visible
        ) {

            this.text.setText(
                content
            );
        }
    }

    hide(): void {

        this.container.setVisible(
            false
        );
    }

    isVisible(): boolean {

        return this.container.visible;
    }

    toggle(
        content: string
    ): void {

        if (
            this.container.visible
        ) {

            this.hide();

            return;
        }

        this.show(
            content
        );
    }
}