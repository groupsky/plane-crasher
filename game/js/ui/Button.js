/* global Phaser */

const AbstractButton = require('./AbstractButton')
const Label = require('./Label')

class Button extends AbstractButton {
  constructor (game, x, y, text, style, parent) {
    super(game, x, y, style, parent)

    this.label = new Label(this.game, 0, 4, text, style, this)
    this.label.anchor.set(0.5)

  }

  get text () {
    return this.label.text
  }

  set text (value) {
    this.label.text = value
  }

}

module.exports = Button
