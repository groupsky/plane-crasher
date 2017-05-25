/* global Phaser */

const Button = require('./Button')

class ButtonFont extends Button {
  constructor (game, x, y, frame, text, size, parent) {
    super(game, x, y, text, {
      frame: frame || 'buttonLarge',
      size: size,
      font: 'kenvector_future',
      color: '#000000'
    }, parent)
  }
}

module.exports = ButtonFont
