import style from "./main.css"

import 'phaser'

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 640,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
        gravity: { y: 0 }
      }
    }
};

window.game = new Phaser.Game(config)