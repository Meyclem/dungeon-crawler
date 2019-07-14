import Phaser from 'phaser'
import Dungeon from '@mikewesthad/dungeon'
import Player from './player.js'
import TILES from './tile-mapping'

window.Dungeon = Dungeon

export default class DungeonScene extends Phaser.Scene {

  constructor ()
  {
      super({ key: 'Level', active: true });
  }

  preload() {
    this.load.image("tiles", "src/assets/images/tiles.png")
    this.load.spritesheet(
      "characters",
      "src/assets/images/characters/hero.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    )
  }

  create() {
    // Generate a random world
    this.dungeon = new Dungeon({
      width: 100,
      height: 100,
      doorPadding: 3,
      rooms: {
        width: { min: 7, max: 20, onlyOdd: true },
        height: { min: 7, max: 20, onlyOdd: true },
        maxRooms: 7,
        maxArea: 150
      }
    })

    // const html = this.dungeon.drawToHtml({
    //   empty: " ",
    //   wall: "📦",
    //   floor: "☁️",
    //   door: "🚪",
    //   emptyAttributes: { style: 'font-size:2px' },
    //   floorAttributes: { style: 'font-size:2px' },
    //   doorAttributes: { style: 'font-size:2px' },
    //   wallAttributes: { style: 'font-size:2px' }
    // })

    // document.body.appendChild(html)

    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.dungeon.width,
      height: this.dungeon.height
    })
    const tileset = map.addTilesetImage("tiles", null, 16, 16) // 1px margin, 2px spacing
    this.groundLayer = map.createBlankDynamicLayer("Ground", tileset)
    this.stuffLayer = map.createBlankDynamicLayer("Stuff", tileset)

    this.groundLayer.fill(TILES.BLANK)

    this.dungeon.rooms.forEach(room => {
      const { x, y, width, height, left, right, top, bottom } = room

      this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR)

      this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top)
      this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top)
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom)
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom)

      this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP)
      this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM)
      this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT)
      this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT)

      var doors = room.getDoorLocations()
      for (var i = 0; i < doors.length; i++) {
      if (doors[i].y === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y)
        } else if (doors[i].y === room.height - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y)
        } else if (doors[i].x === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 1)
        } else if (doors[i].x === room.width - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 1)
        }
      }
    })

    const rooms = this.dungeon.rooms.slice()
    const startRoom = rooms.shift()
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms)
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9)

    this.groundLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY)

    otherRooms.forEach(room => {
      var rand = Math.random()
      if (rand <= 0.25) {
        // 25% chance of chest
        this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY)
      } else if (rand <= 0.5) {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        const x = Phaser.Math.Between(room.left + 2, room.right - 2)
        const y = Phaser.Math.Between(room.top + 2, room.bottom - 2)
        this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT)
      } else {
        // 25% of either 2 or 4 towers, depending on the room size
        if (room.height >= 10) {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.left + 2, room.top + 1)
          this.stuffLayer.putTilesAt(TILES.TOWER, room.right -2, room.top + 1)
          this.stuffLayer.putTilesAt(TILES.TOWER, room.left + 2, room.bottom - 3)
          this.stuffLayer.putTilesAt(TILES.TOWER, room.right - 2, room.bottom - 3)
        } else {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX, room.centerY -1 )
          // this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1)
        }
      }
    })

    this.groundLayer.setCollisionByExclusion([-1, 3, 0, 20, 21, 23, 43, 327])
    this.stuffLayer.setCollisionByExclusion([-1, 347])
    this.stuffLayer.setDepth(2)

    this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2)

    this.physics.add.collider(this.player.sprite, this.groundLayer)
    this.physics.add.collider(this.player.sprite, this.stuffLayer)

    const camera = this.cameras.main
    camera.setZoom(3)
    camera.startFollow(this.player.sprite)
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // Help text that has a "fixed" position on the screen
    // this.add
    //   .text(16, 16, "Arrow keys to move", {
    //     font: "14px monospace",
    //     fill: "#000000",
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#ffffff"
    //   })
    //   .setScrollFactor(0)
  }

  update(time, delta) {
    this.player.update()
  }
}
