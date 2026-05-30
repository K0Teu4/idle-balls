import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    backgroundColor: "#101010",

    physics: {
        default: "matter",
        matter: {
            gravity: {
                y: 1
            },
            debug: false
        }
    },

    scene: [GameScene]
};

new Phaser.Game(config);