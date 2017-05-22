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
    return { profit: this.profit, interval: this.interval }
  }

  update () {
    this._timer += this.game.time.realElapsed

    const profit = Math.floor(this._timer / this.interval) * this.profit
    if (profit <= 0) return

    this.game.inventory.gold += profit
    this.game.stats.totals.gold.bots += profit

    this._timer %= this.interval

    this.game.save()
  }

}

module.exports = Bot