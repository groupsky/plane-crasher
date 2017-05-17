const Item = require('./Item')

class Bot extends Item {
  constructor (game, parent) {
    super(game, parent)

    this.game = game

    this._timer = 0
  }

  init (state) {
    this.profit = state.profit
    this.interval = state.interval
  }
  
  save () {
    return {profit: this.profit, interval: this.interval}
  }

  update () {
    this._timer += this.game.time.realElapsed

    this.game.inventory.gold += Math.floor(this._timer / this.interval) * this.profit

    this._timer %= this.interval
  }

}

module.exports = Bot