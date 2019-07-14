import style from "./main.css"
import DungeonScene from "./assets/js/dungeon-scene";
import Hud from "./assets/js/interface";

import 'phaser'

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1024,
    height: 768,
    pixelArt: true,
    scene: [DungeonScene, Hud],
    physics: {
      default: "arcade",
      arcade: {
        // debug: true,
        gravity: { y: 0 }
      }
    }
};

window.game = new Phaser.Game(config)