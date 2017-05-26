/* global Phaser */

const Button = require('./Button')
const formatNumber = require('../utils').formatNumber
const formatDuration = require('../utils').formatDuration
const Label = require('./Label')
const ProgressBar = require('../ui/ProgressBar')
const styles = require('./styles')

class BotInfo extends Phaser.Group {
  constructor (game, x, y, width, bot, parent) {
    super(game, parent, 'botInfo')

    this._width = width
    this.bot = bot

    this.upBtn = new Button(this.game, width, 13, 'UP', styles.btnBotUpg, this)
    this.upBtn.scale.set(26 / this.upBtn.height)
    this.upBtn.x -= this.upBtn.width / 2
    this.upBtn.visible = false

    this.progressBarShadow = new ProgressBar(this.game, 0, 0, width, 'Shadow', this)
    this.progressBarShadow.progress = 1
    this.progressBar = new ProgressBar(this.game, 0, 0, width, 'Blue', this)
    this.progressBar.progress = 0

    this.profitLabel = new Label(this.game, width * 0.5, 0, formatNumber(bot.profit, formatNumber.gold), styles.botInfoLabel, this)
    this.profitLabel.anchor.set(0.5, 0)
    this.remainingLabel = new Label(this.game, width * 0.5, 12, '', styles.botInfoLabel, this)
    this.remainingLabel.anchor.set(0.5, 0)

    this.x = x
    this.y = y
  }

  reset () {
    this.profitLabel.text = formatNumber(this.bot.profit, formatNumber.gold)
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
