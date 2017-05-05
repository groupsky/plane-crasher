/* global Phaser */

class Button extends Phaser.Group {
  constructor (game, x, y, frame, text) {
    super(game)

    frame = frame || 'buttonLarge'

    this.background = this.game.add.button(0, 0, 'sheet', null, null, frame, frame, frame, frame)
    this.width = this.background.width
    this.height = this.background.height
    this.add(this.background)

    this.label = this.game.add.bitmapText(this.width / 2, this.height / 2, 'font', text, this.height / 2, this)
    this.label.align = 'center'
    this.label.anchor.set(0.5)

    this.x = x - this.width / 2
    this.y = y - this.height / 2

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
