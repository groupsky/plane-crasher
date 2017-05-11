const Item = require('./Item')

class Recording extends Item {
  constructor (game, parent) {
    super(game, parent)

    this.score = 0
    this.time = 0
    this.distance = 0
    this.obstacles = 0
  }

  init (score, time, distance, obstacles) {
    this.score = score
    this.time = time
    this.distance = distance
    this.obstacles = obstacles
  }
}

module.exports = Recording
