/* global Phaser */

class Plane extends Phaser.Sprite {
  constructor (game, x, y, frame) {
    super(game, x, y, 'sheet')

    this.anchor.setTo(0.5, 0.5)

    this.animations.add('default', Phaser.Animation.generateFrameNames(frame, 1, 3, '.png'), 30, true)
    this.animations.play('default')

    this.name = 'bird'
    this.alive = false

    this.game.physics.arcade.enableBody(this)
    this.body.allowGravity = false
    this.body.collideWorldBounds = true
    this.body.setSize(this.width - 10, this.height - 10, 5, 5)

    this.events.onKilled.add(this.onKilled, this)
  }

  jump () {
    if (!this.alive) return

    this.body.velocity.y = -600

    this.game.add.tween(this).to({ angle: -60 }, 100).start()
  }

  update () {
    if (this.angle < 60 && this.alive) {
      this.angle += 2.5
    }

    if (!this.alive) {
      this.body.velocity.x = 0
    }
  }

  onKilled () {
    this.exists = true
    this.visible = true
    this.animations.stop()
  }
}

module.exports = Plane
