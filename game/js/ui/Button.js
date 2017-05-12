/* global Phaser */

class Button extends Phaser.Group {
  constructor (game, x, y, frame, text, size) {
    super(game)

    frame = frame || 'buttonLarge'

    this.background = this.game.add.button(0, 0, 'sheet', null, null, frame, frame, frame, frame)
    this.background.anchor.set(0.5)
    this.add(this.background)

    if (size === undefined) size = this.background.height / 2

    this.label = this.game.add.bitmapText(0, 0, 'font', text, size, this)
    this.label.align = 'center'
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
