class Obstacle extends Phaser.Sprite {
  constructor(game, x, y, frame) {
    super(game, x, y, 'sheet', frame)
    
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.arcade.enableBody(this)
    
    this.body.allowGravity = false
    this.body.immovable = true

    this.body.setSize(18, this.height, this.width/2, 0)
  }
}

module.exports = Obstacle