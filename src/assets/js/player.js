/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene

    const anims = scene.anims
    anims.create({
      key: "player-walk",
      frames: anims.generateFrameNumbers("characters", { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    })
    anims.create({
      key: "player-walk-side",
      frames: anims.generateFrameNumbers("characters", { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    })
    anims.create({
      key: "player-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 16, end: 19 }),
      frameRate: 8,
      repeat: -1
    })
    anims.create({
      key: "player-idle-face",
      frames: anims.generateFrameNumbers("characters", { frames: [0, 1, 2, 1] }),
      frameRate: 3,
      repeat: -1
    })

    this.sprite = scene.physics.add
      .sprite(x, y, "characters", 0)
      .setSize(14, 12)
      .setOffset(17, 20)

    this.sprite.anims.play("player-idle-face")

    this.keys = scene.input.keyboard.createCursorKeys()
  }

  freeze() {
    this.sprite.body.moves = false
  }

  update() {
    const keys = this.keys
    const sprite = this.sprite
    let speed = 100
    // if (keys.shift.isDown) {
    //   speed = 150
    // }
    const prevVelocity = sprite.body.velocity.clone()

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0)
    // Horizontal movement
    if (keys.left.isDown) {
      sprite.body.setVelocityX(-speed)
      if (sprite.anims.currentAnim.key === 'player-walk-side') {
        sprite.setFlipX(true)
      }
    } else if (keys.right.isDown) {
      sprite.body.setVelocityX(speed)
      if (sprite.anims.currentAnim.key === 'player-walk-side') {
        sprite.setFlipX(false)
      }
    }

    // Vertical movement
    if (keys.up.isDown) {
      sprite.body.setVelocityY(-speed)
    } else if (keys.down.isDown) {
      sprite.body.setVelocityY(speed)
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed)

    // Update the animation last and give left/right/down animations precedence over up animations
    if (keys.down.isDown) {
      sprite.anims.play("player-walk", true)
    } else if (keys.up.isDown) {
      sprite.anims.play("player-walk-back", true)
    } else if (keys.left.isDown || keys.right.isDown) {
      sprite.anims.play("player-walk-side", true)
    } else {
      // sprite.anims.stop()

      // If we were moving & now we're not, then pick a single idle frame to use
      if (prevVelocity.y < 0) this.sprite.anims.play("player-idle-face", true)
      else this.sprite.anims.play("player-idle", true)
    }
  }

  destroy() {
    this.sprite.destroy()
  }
}
