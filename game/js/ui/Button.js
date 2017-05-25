/* global Phaser */

const Label = require('./Label')

class Button extends Phaser.Group {
  constructor (game, x, y, text, style, parent) {
    super(game, parent, 'button')

    const frame = (style && style.frame) || 'buttonLarge'
    const sheet = (style && style.sheet) || 'sheet'
    const customButton = frame.indexOf('button') === 0

    this.background = this.game.add.button(0, 0, sheet, null, null, frame + (customButton ? '': '_button04'), frame + (customButton ? '' : '_button02'), frame + (customButton ? '' : '_button05'), frame + (customButton ? '' : '_button04'), this)
    this.background.anchor.set(0.5)

    if (style.size === undefined) style.size = this.background.height / 2

    this.label = new Label(this.game, 0, 0, text, style, this)
    this.label.anchor.set(0.5)

    this.x = x
    this.y = y

    this.clickSound = this.game.add.audio('click')

    this.onInputUp = this.background.onInputUp
    this.background.onInputDown.add(this.playSound, this)
  }

  get text () {
    return this.label.text
  }

  set text (value) {
    this.label.text = value
  }

  playSound () {
    this.clickSound.play()
  }
}

module.exports = Button
