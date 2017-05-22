class Item {
  constructor (game, parent) {
    if (parent === undefined) parent = null

    this.game = game
    this.parent = parent
    this.active = false
    this.hasUpdate = false
  }

  destroy () {
    this.game = null
    this.parent = null
    this.active = false
  }
}

module.exports = Item
