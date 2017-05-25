/* global Phaser */

const ButtonFont = require('../ui/ButtonFont')
const BotInfo = require('../ui/BotInfo')
const TopBar = require('../actors/TopBar')
const formatNumber = require('../utils').formatNumber
const formatDuration = require('../utils').formatDuration

class Bots extends Phaser.Stage {
  create () {
    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.autoScroll(-100, 0)

    const topBar = new TopBar(this.game)
    topBar.title = 'Bots'
    topBar.backEnabled = true

    const panelLeft = this.add.image(16, topBar.height + 16, 'sheet', 'UIbg')
    panelLeft.height = this.world.height - 32 - topBar.height
    const panelRightTop = this.add.image(this.world.centerX + 8, topBar.height + 16, 'sheet', 'UIbg')
    const panelRightBottom = this.add.image(this.world.centerX + 8, this.world.centerY + 32, 'sheet', 'UIbg')
    panelLeft.width = panelRightTop.width = panelRightBottom.width = this.world.centerX - 24
    panelRightTop.height = panelRightBottom.height = (this.world.height - topBar.height - 32 - 16) / 2
    const statStyle = {
      font: '18px kenvector_future_thin',
      fill: '#333',
      align: 'left',
      boundsAlignH: 'left',
      boundsAlignV: 'top',
    }
    const statSmStyle = {
      font: '12px kenvector_future_thin',
      fill: '#333',
      align: 'left',
      boundsAlignH: 'left',
      boundsAlignV: 'top',
    }
    const titleStyle = {
      font: '26px kenvector_future',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }
    const idle = this.game.idle.idleEngine
    const stats = idle.stats
    const botsTitle = this.add.text(panelLeft.x + panelLeft.width * 0.5, panelLeft.y + 6, 'Bots', titleStyle)
    botsTitle.anchor.set(0.5, 0)
    const botsTotalLabel = this.add.text(panelLeft.x + panelLeft.width - 8, panelLeft.y + panelLeft.height - 8,
      'Bots: ' + Math.floor(idle.bots.items.length), statStyle)
    botsTotalLabel.anchor.set(1, 1)
    const botsUpgradeHint = this.add.text(panelLeft.x + 8, panelLeft.y + panelLeft.height - 8,
      'Up cost: ' + formatNumber(-idle.botCost(-1), formatNumber.gold), statStyle)
    botsUpgradeHint.anchor.set(0, 1)

    let y = botsTitle.y + botsTitle.height + 8
    for (let i = 0; i < idle.bots.items.length; i++) {
      const botInfo = new BotInfo(this.game, panelLeft.x + 8, y, panelLeft.width - 16, idle.bots.items[ i ])
      botInfo.upBtn.onInputUp.add(() => {
        idle.upBot(botInfo.bot)
        botInfo.upgradeable = botInfo.bot.profit < Math.floor(stats.best.score)
        botInfo.reset()
      })
      botInfo.upgradeable = botInfo.bot.profit < Math.floor(stats.best.score)
      this.add.existing(botInfo)
      y += botInfo.height
    }

    const highscoreTitle = this.add.text(panelRightTop.x + panelRightTop.width * 0.5, panelRightTop.y + 8, 'Highscore', titleStyle)
    highscoreTitle.anchor.set(0.5, 0)
    this.add.text(panelRightTop.x + 16, panelRightTop.y + 12 + highscoreTitle.height, [
      'score: ' + formatNumber(stats.best.score, formatNumber.gold),
      'time: ' + formatDuration(stats.best.time * 1000),
      'distance: ' + formatNumber(stats.best.distance, formatNumber.distance),
      'obstacles: ' + formatNumber(stats.best.obstacles)
    ].join('\n'), statStyle)

    const buyBotTitle = this.add.text(panelRightBottom.x + panelRightBottom.width * 0.5, panelRightBottom.y + 8, 'Buy Bot', titleStyle)
    buyBotTitle.anchor.set(0.5, 0)
    const buyBotLabel = this.add.text(panelRightBottom.x + 16, panelRightBottom.y + 12 + buyBotTitle.height, [
      'Bots are automated units that\noperate a plane earning the same',
      'gold as you, but 10 times slower.'
    ].join('\n'), statSmStyle)
    this.buyBtn = new ButtonFont(this.game, panelRightBottom.x + panelRightBottom.width * 0.5, (panelRightBottom.y + panelRightBottom.height + buyBotLabel.y + buyBotLabel.height) * 0.5 - 4, 'buttonLarge', formatNumber(idle.botCost(1), formatNumber.gold), 14)
    this.buyBtn.onInputUp.add(() => idle.buyBot(1))

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }
}

module.exports = Bots
