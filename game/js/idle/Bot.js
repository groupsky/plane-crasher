const Item = require('./Item')

class Bot extends Item {
  constructor (game, parent) {
    super(game, parent)

    this.game = game

    this.profit = 0
    this.interval = 0
    this.count = 0
    this._timer = 0
  }

  init (state) {
    this.profit = state && (state.profit || 0)
    this.interval = state && (state.interval || 0)
    this.count = state && (state.count || 0)
    this._timer = state && (state.timer || 0)
  }

  save () {
    return {
      profit: this.profit,
      interval: this.interval,
      count: this.count,
      timer: this._timer
    }
  }

  get progress () { return (this._timer % this.interval) / this.interval }

  get remaining () { return this.interval * (1 - this.progress) }

  update () {
    this._timer += this.game.time.realElapsed

    const count = Math.floor(this._timer / this.interval)
    if (count <= 0) return
    const profit = count * this.profit

    this.count += count
    this.game.inventory.gold += profit
    this.game.stats.totals.gold.bots += profit

    this._timer %= this.interval

    this.game.save()
  }

}

module.exports = Bot