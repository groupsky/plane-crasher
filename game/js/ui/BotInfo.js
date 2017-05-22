/* global Phaser */

const moment = require('moment')
const ProgressBar = require('../ui/ProgressBar')

class BotInfo extends Phaser.Group {
  constructor (game, x, y, width, bot) {
    super(game, null, 'botInfo')

    this._width = width
    this.bot = bot

    const progressBarShadow = new ProgressBar(this.game, 0, 0, width, 'Shadow', this)
    progressBarShadow.progress = 1
    this.progressBar = new ProgressBar(this.game, 0, 0, width, 'Blue', this)
    this.progressBar.progress = 0

    this.profitLabel = this.game.add.text(width * 0.5, 0, '' + Math.floor(bot.profit), {
      font: '12px kenvector_future_thin',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }, this)
    this.profitLabel.anchor.set(0.5, 0)
    this.remainingLabel = this.game.add.text(width * 0.5, 12, '', {
      font: '12px kenvector_future_thin',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }, this)
    this.remainingLabel.anchor.set(0.5, 0)

    this.x = x
    this.y = y
  }

  update () {
    this.progressBar.progress = this.bot.progress
    this.remainingLabel.text = moment.duration(this.bot.remaining).humanize()
  }
}

module.exports = BotInfo
