/* global Phaser */

class ProgressBar extends Phaser.Group {
  constructor (game, x, y, maxWidth, theme, parent) {
    super(game, parent, 'progressBar')

    this._maxWidth = maxWidth
    this._progress = 0
    this._left = this.game.add.image(0, 0, 'bar' + theme + 'Left', undefined, this)
    this._mid = this.game.add.image(this._left.x + this._left.width, 0, 'bar' + theme + 'Mid', undefined, this)
    this._mid.width = 0
    this._right = this.game.add.image(this._mid.x + this._mid.width, 0, 'bar' + theme + 'Right', undefined, this)

    this._midWidth = this._maxWidth - this._left.width - this._right.width
  }

  get progress () { return this._progress }

  set progress (value) {
    this._mid.width = this._midWidth * value
    this._right.left = this._mid.x + this._mid.width
  }

}

module.exports = ProgressBar
