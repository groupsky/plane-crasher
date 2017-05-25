/* global Phaser */

const Label = require('./Label')

class Button extends Phaser.Group {
  constructor (game, x, y, text, style, parent) {
    super(game, parent, 'button')

    const frame = (style && style.frame) || 'buttonLarge'

    this.background = this.game.add.button(0, 0, 'sheet', null, null, frame, frame, frame, frame, this)
    this.background.anchor.set(0.5)

    if (style.size === undefined) style.size = this.background.height / 2

    this.label = new Label(this.game, 0, 0, text, style, this)
    this.label.anchor.set(0.5)

    this.x = x
    this.y = y

    this.onInputUp = this.background.onInputUp
  }

  get text () {
    return this.label.text
  }

  set text (value) {
    this.label.text = value
  }
}

module.exports = Button
