import Phaser from "phaser";

export class StatisticsWindow {

    private container:
        Phaser.GameObjects.Container;

    private text:
        Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene
    ) {

        const background =
            scene.add.rectangle(
                640,
                360,
                500,
                350,
                0x222222
            )
            .setStrokeStyle(
                2,
                0x666666
            );

        this.text =
            scene.add.text(
                640,
                240,
                "",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    align: "center"
                }
            )
            .setOrigin(0.5, 0);

        const closeButton =
            scene.add.text(
                640,
                500,
                "CLOSE",
                {
                    fontSize: "28px",
                    color: "#ffffff",
                    backgroundColor: "#aa3333",
                    padding: {
                        left: 12,
                        right: 12,
                        top: 6,
                        bottom: 6
                    }
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
                    background,
                    this.text,
                    closeButton
                ]
            );

        this.container
            .setDepth(5000)
            .setVisible(false);
    }

    show(
        content: string
    ): void {

        this.text.setText(
            content
        );

        this.container.setVisible(
            true
        );
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