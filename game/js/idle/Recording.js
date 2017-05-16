const Item = require('./Item')

class Recording extends Item {
  constructor (game, parent) {
    super(game, parent)

    this.score = 0
    this.time = 0
    this.distance = 0
    this.obstacles = 0
  }

  init (state) {
    this.score = state.score
    this.time = state.time
    this.distance = state.distance
    this.obstacles = state.obstacles
  }

  save () {
    return {
      score: this.score,
      time: this.time,
      distance: this.distance,
      obstacles: this.obstacles
    }
  }
}

module.exports = Recording
