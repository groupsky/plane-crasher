/* global Phaser */

class Ground extends Phaser.TileSprite {
  constructor (game, x, y, width, height, frame) {
    super(game, x, y, width, 71, 'sheet', frame)

    this.anchor.setTo(0, 1)

    this.game.physics.arcade.enableBody(this)
    this.body.allowGravity = false
    this.body.immovable = true

    this.body.setSize(this.width, this.height * 0.75, 0, this.height * 0.25)
  }
}

module.exports = Ground
