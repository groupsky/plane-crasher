/* global Phaser */

class Panel extends Phaser.Group {

  constructor (game, x, y, frame) {
    super(game)

    this.background = this.create(0, 0, 'sheet', frame || 'UIbg')
    this.width = this.background.width
    this.height = this.background.height

    this.x = x - this.width / 2
    this.y = y - this.height / 2
  }

}

module.exports = Panel
