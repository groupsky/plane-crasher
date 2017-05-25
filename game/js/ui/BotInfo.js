/* global Phaser */

const formatNumber = require('../utils').formatNumber
const formatDuration = require('../utils').formatDuration
const Button = require('./ButtonFont')
const ProgressBar = require('../ui/ProgressBar')

class BotInfo extends Phaser.Group {
  constructor (game, x, y, width, bot) {
    super(game, null, 'botInfo')

    this._width = width
    this.bot = bot

    this.upBtn = new Button(this.game, width, 13, 'buttonSmall', 'UP', 32, this)
    this.upBtn.scale.set(26 / this.upBtn.height)
    this.upBtn.x -= this.upBtn.width / 2
    this.upBtn.visible = false

    // width -= this.upBtn.width + 4

    this.progressBarShadow = new ProgressBar(this.game, 0, 0, width, 'Shadow', this)
    this.progressBarShadow.progress = 1
    this.progressBar = new ProgressBar(this.game, 0, 0, width, 'Blue', this)
    this.progressBar.progress = 0

    this.profitLabel = this.game.add.text(width * 0.5, 0, formatNumber(bot.profit, formatNumber.gold), {
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

  set upgradeable (value) {
    value = !!value
    if (this.upBtn.visible === value) return
    const width = this.width - (value ? (this.upBtn.width + 4) : 0)
    this.upBtn.visible = value
    this.progressBarShadow.maxWidth = width
    this.progressBar.maxWidth = width
    this.profitLabel.x = width * 0.5
    this.remainingLabel.x = width * 0.5
  }

  update () {
    this.progressBar.progress = this.bot.progress
    this.remainingLabel.text = formatDuration(this.bot.remaining)
  }
}

module.exports = BotInfo
