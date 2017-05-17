/* global Phaser */

const Button = require('./Button')
const Panel = require('./Panel')

class EndGame extends Phaser.Group {
  constructor (game) {
    super(game)

    this.panel = new Panel(this.game, this.game.width / 2, this.game.height / 2)
    this.add(this.panel)

    this.gameover = this.create(this.game.width / 2, this.game.height / 2 - this.panel.height / 2, 'sheet', 'textGameOver')
    this.gameover.anchor.set(0.5)

    this.label = this.game.add.bitmapText(this.panel.width / 2, this.panel.height / 4, 'font', 'score', 24)
    this.label.anchor.set(0.5)
    this.panel.add(this.label)

    this.scoreText = this.game.add.bitmapText(this.panel.width / 2, this.panel.height / 2, 'font', '123456', 48)
    this.scoreText.anchor.set(0.5)
    this.panel.add(this.scoreText)

    this.btnRetry = new Button(this.game, this.panel.width / 2, this.panel.height - 50, 'buttonLarge', 'retry')
    this.panel.add(this.btnRetry)

    this.onRetry = this.btnRetry.onInputUp
  }

  set score (value) {
    this.scoreText.text = '' + value
  }
}

module.exports = EndGame
