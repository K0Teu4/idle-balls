import "./style.css";
import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { GAME_HEIGHT, GAME_WIDTH } from "./config/GameConfig";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: GAME_WIDTH,
    height: GAME_HEIGHT,

    backgroundColor: "#0c0c0c",

    parent: "app",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    fps: {
        target: 60,
        forceSetTimeOut: true
    },

    physics: {
        default: "matter",
        matter: {
            gravity: { x: 0, y: 1 },
            debug: false
        }
    },

    scene: [GameScene]
};

new Phaser.Game(config);
