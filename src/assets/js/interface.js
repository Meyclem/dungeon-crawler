export default class Hud extends Phaser.Scene {

  constructor ()
  {
      super({ key: 'Hud', active: true });
  }

  create ()
  {
    this.add
    .text(10, 10, "Arrow keys to move", {
      font: "14px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(2)
  }
}