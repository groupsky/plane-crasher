/* global Phaser */

class Panel extends Phaser.Group {

  constructor (game, parent, x, y, frame) {
    super(game, parent, 'panel')

    this.background = this.create(0, 0, 'sheet', frame || 'UIbg')
    this.background.anchor.set(0.5)

    this.x = x
    this.y = y
  }

}

module.exports = Panel
