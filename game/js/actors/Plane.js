/* global Phaser */

class Plane extends Phaser.Sprite {
  constructor (game, x, y, frame) {
    super(game, x, y, 'sheet')

    this.anchor.setTo(0.5, 0.5)

    this.animations.add('default', Phaser.Animation.generateFrameNames(frame, 1, 3, '.png'), 30, true)
    this.animations.play('default')

    this.game.physics.arcade.enableBody(this)

    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.alive = false

    this.body.setSize(this.width - 10, this.height - 10, 5, 5)

    this.body.allowGravity = false
  }

  jump () {
    this.body.velocity.y = -600

    this.game.add.tween(this).to({angle: -60}, 100).start()
  }

  update () {
    if (this.angle < 60 && this.alive) {
      this.angle += 2.5
    }
  }
}

module.exports = Plane
