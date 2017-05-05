const Obstacle = require('./Obstacle')

class ObstacleGroup extends Phaser.Group {
  constructor (game, parent, frame) {
    super(game, parent)

    this.frame = frame

    this.topObstacle = new Obstacle(this.game, 0, 0, this.frame + 'Down.png')
    this.add(this.topObstacle)

    this.bottomObstacle = new Obstacle(this.game, 0, this.game.height, this.frame + '.png')
    this.add(this.bottomObstacle)
  }

  reset (x, y, difficulty) {
    // lim -> 0.5
    const offset = difficulty / (2 * difficulty + 10)

    this.topObstacle.reset(0, this.topObstacle.height * offset)
    this.bottomObstacle.reset(0, this.game.height - this.bottomObstacle.height * offset)

    this.x = x
    this.y = y

    this.setAll('body.velocity.x', -200)

    this.hasScored = false
    this.exists = true
  }

  checkWorldBounds () {
    if (!this.topObstacle.inWorld)
      this.exists = false
  }

  update () {
    this.checkWorldBounds()
  }

  stop () {
    this.setAll('body.velocity.x', 0)
  }
}

module.exports = ObstacleGroup
