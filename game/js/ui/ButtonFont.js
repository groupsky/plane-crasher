/* global Phaser */

class ButtonFont extends Phaser.Group {
  constructor (game, x, y, frame, text, size, parent) {
    super(game, parent)

    frame = frame || 'buttonLarge'

    this.background = this.game.add.button(0, 0, 'sheet', null, null, frame, frame, frame, frame)
    this.background.anchor.set(0.5)
    this.width = this.background.width
    this.height = this.background.height
    this.add(this.background)

    this.label = this.game.add.text(0, 0, text, {
      font: size + 'px kenvector_future',
      fill: '#000000',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    }, this)
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

module.exports = ButtonFont
