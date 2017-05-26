/* global Phaser */

const AbstractButton = require('./AbstractButton')

class ImageButton extends AbstractButton {
  constructor (game, x, y, sheet, frame, style, parent) {
    super(game, x, y, style, parent)

    this.icon = this.game.add.image(-1,-2,sheet, frame, this)
    this.icon.anchor.set(0.5)

  }

}

module.exports = ImageButton
