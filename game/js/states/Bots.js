/* global Phaser */

const styles = require('../ui/styles')
const Button = require('../ui/Button')
const BotInfo = require('../ui/BotInfo')
const Label = require('../ui/Label')
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

    this.panelLeft = this.add.image(16, topBar.height + 16, 'sheet', 'UIbg')
    this.panelLeft.height = this.world.height - 32 - topBar.height
    const panelRightTop = this.add.image(this.world.centerX + 8, topBar.height + 16, 'sheet', 'UIbg')
    const panelRightBottom = this.add.image(this.world.centerX + 8, this.world.centerY + 32, 'sheet', 'UIbg')
    this.panelLeft.width = panelRightTop.width = panelRightBottom.width = this.world.centerX - 24
    panelRightTop.height = panelRightBottom.height = (this.world.height - topBar.height - 32 - 16) / 2

    const idle = this.game.idle.idleEngine
    const stats = idle.stats
    const botsTitle = new Label(this.game,
      this.panelLeft.x + this.panelLeft.width * 0.5,
      this.panelLeft.y + 12, 'Bots', styles.titleStyle)
    botsTitle.anchor.set(0.5, 0)
    const botsTotalLabel = new Label(this.game, this.panelLeft.x + this.panelLeft.width - 8, this.panelLeft.y + this.panelLeft.height - 8,
      'Bots: ' + Math.floor(idle.bots.items.length), styles.statStyle)
    botsTotalLabel.anchor.set(1, 1)
    const botsUpgradeHint = new Label(this.game, this.panelLeft.x + 8, this.panelLeft.y + this.panelLeft.height - 8,
      'Up cost: ' + formatNumber(-idle.botCost(-1), formatNumber.gold), styles.statStyle)
    botsUpgradeHint.anchor.set(0, 1)

    this.lastBotY = botsTitle.y + botsTitle.height + 8
    for (let i = 0; i < idle.bots.items.length; i++) {
      this.addBot(idle.bots.items[ i ])
    }

    const highscoreTitle = new Label(this.game,
      panelRightTop.x + panelRightTop.width * 0.5,
      panelRightTop.y + 12, 'Highscore', styles.titleStyle)
    highscoreTitle.anchor.set(0.5, 0)
    const highscoreLabel = new Label(this.game,
      panelRightTop.x + 16,
      panelRightTop.y + 24 + highscoreTitle.height, [
        'score: ' + formatNumber(stats.best.score, formatNumber.gold),
        'time: ' + formatDuration(stats.best.time * 1000),
        'distance: ' + formatNumber(stats.best.distance, formatNumber.distance),
        'obstacles: ' + formatNumber(stats.best.obstacles)
      ].join('\n'), styles.statStyle)

    const buyBotTitle = new Label(this.game,
      panelRightBottom.x + panelRightBottom.width * 0.5,
      panelRightBottom.y + 12, 'Buy Bot', styles.titleStyle)
    buyBotTitle.anchor.set(0.5, 0)
    const buyBotLabel = new Label(this.game,
      panelRightBottom.x + 16,
      panelRightBottom.y + 24 + buyBotTitle.height, [
        'Bots are automated units that',
        'operate a plane earning',
        'the same gold as you,',
        'but 10 times slower.'
      ].join('\n'), styles.statSmStyle)
    this.buyBtn = new Button(this.game,
      panelRightBottom.x + panelRightBottom.width * 0.5,
      (panelRightBottom.y + panelRightBottom.height + buyBotLabel.y + buyBotLabel.height) * 0.5 - 4,
      formatNumber(idle.botCost(1), formatNumber.gold),
      styles.btnLarge)
    this.buyBtn.onInputUp.add(this.buyBot, this)

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  buyBot () {
    const bot = this.game.idle.idleEngine.buyBot(1)
    if (bot) {
      this.addBot(bot)
    }
  }

  addBot (bot) {
    const botInfo = new BotInfo(this.game, this.panelLeft.x + 8, this.lastBotY, this.panelLeft.width - 16, bot, this)
    botInfo.upBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.upBot(bot)
      botInfo.upgradeable = botInfo.bot.profit < Math.floor(this.game.idle.idleEngine.stats.best.score)
      botInfo.reset()
    })
    botInfo.upgradeable = botInfo.bot.profit < Math.floor(this.game.idle.idleEngine.stats.best.score)
    this.add.existing(botInfo)
    this.lastBotY += botInfo.height
  }
}

module.exports = Bots
