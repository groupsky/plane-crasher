/* global Phaser */

const Label = require('./Label')

class Button extends Phaser.Group {
  constructor (game, x, y, text, style, parent) {
    super(game, parent, 'button')

    this.frame = (style && style.frame) || 'buttonLarge'
    this.sheet = (style && style.sheet) || 'sheet'
    this.disabledSheet = (style && style.disabledSheet) || 'grey_out'
    this.customButton = this.frame.indexOf('button') === 0

    this.frameOver = this.frame + (this.customButton ? '' : '_over')
    this.frameOut = this.frame + (this.customButton ? '' : '_out')
    this.frameDown = this.frame + (this.customButton ? '' : '_down')

    this.background = this.game.add.button(0, 0, this.sheet, null, null, this.frameOver, this.frameOut, this.frameDown, this.frameOver, this)
    this.background.anchor.set(0.5)

    if (style.size === undefined) style.size = this.background.height / 2

    this.label = new Label(this.game, 0, 4, text, style, this)
    this.label.anchor.set(0.5)

    this.x = x
    this.y = y

    this.clickSound = this.game.add.audio('click')

    this.onInputDown = this.background.onInputDown
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

  set disabled (isDisabled) {
    if (isDisabled) {
      this.background.setFrames(this.disabledSheet, this.disabledSheet, this.disabledSheet, this.disabledSheet)
    } else {
      this.background.setFrames(this.frameOver, this.frameOut, this.frameDown, this.frameOver)
    }
  }
}

module.exports = Button
