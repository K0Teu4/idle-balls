import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GameScene } from "./game/scenes/GameScene";

export default function App() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            backgroundColor: "#101418",
            parent: containerRef.current,
            physics: {
                default: "matter",
                matter: {
                    gravity: { x: 0, y: 1.5 },
                    debug: false,
                },
            },
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        });

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                background: "#101418",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        />
    );
}
