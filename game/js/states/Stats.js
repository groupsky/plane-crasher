/* global Phaser */

const ButtonFont = require('../ui/ButtonFont')
const moment = require('moment')
const TopBar = require('../actors/TopBar')

class Stats extends Phaser.State {
  create () {
    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.autoScroll(-100, 0)

    const topBar = new TopBar(this.game)
    topBar.title = 'Statistics'
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
    const titleStyle = {
      font: '26px kenvector_future',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }
    const dangerStyle = {
      font: '18px kenvector_future_thin',
      fill: '#c33',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }

    const idle = this.game.idle.idleEngine
    const stats = idle.stats
    const totalsTitle = this.add.text(panelLeft.x + panelLeft.width * 0.5, panelLeft.y + 6, 'Totals', titleStyle)
    totalsTitle.anchor.set(0.5, 0)
    this.add.text(panelLeft.x + 16, panelLeft.y + 2 + totalsTitle.height, [
      'plays: ' + Math.floor(stats.totals.plays),
      'total time: ' + moment.duration(stats.totals.stats.time * 1000).humanize(),
      'obstacles: ' + Math.floor(stats.totals.stats.obstacles),
      'distance: ' + Math.floor(stats.totals.stats.distance) + 'm',
      'turbo used: ' + Math.floor(stats.totals.stats.turbo),
      'turbo time:' + moment.duration(stats.totals.stats.turboTime * 1000).humanize(),
      'jumps: ' + Math.floor(stats.totals.stats.jumps),
      '',
      'obstacle score: ' + Math.floor(stats.totals.scores.obstacles),
      'distance score: ' + Math.floor(stats.totals.scores.distance),
      'total score: ' + Math.floor(stats.totals.scores.total),
      '',
      'gold earned: ' + Math.floor(stats.totals.gold.earned),
      'bots earned: ' + Math.floor(stats.totals.gold.bots),
      'total gold: ' + (Math.floor(stats.totals.gold.earned) + Math.floor(stats.totals.gold.bots)),
    ].join('\n'), statStyle)

    const highscoreTitle = this.add.text(panelRightTop.x + panelRightTop.width * 0.5, panelRightTop.y + 8, 'Highscore', titleStyle)
    highscoreTitle.anchor.set(0.5, 0)
    this.add.text(panelRightTop.x + 16, panelRightTop.y + 12 + highscoreTitle.height, [
      'score: ' + Math.floor(stats.best.score),
      'time: ' + moment.duration(stats.best.time * 1000).humanize(),
      'distance: ' + Math.floor(stats.best.distance),
      'obstacles: ' + Math.floor(stats.best.obstacles)
    ].join('\n'), statStyle)

    const resetTitle = this.add.text(panelRightBottom.x + panelRightBottom.width * 0.5, panelRightBottom.y + 8, 'Reset', titleStyle)
    resetTitle.anchor.set(0.5, 0)
    const resetLabel = this.add.text(panelRightBottom.x + panelRightBottom.width * 0.5, panelRightBottom.y + 12 + resetTitle.height, [
      'this will clear all progress,\nachievements and upgrades!'
    ].join('\n'), dangerStyle)
    resetLabel.anchor.set(0.5, 0)
    this.resetBtn = new ButtonFont(this.game, panelRightBottom.x + panelRightBottom.width * 0.5, (panelRightBottom.y + panelRightBottom.height + resetLabel.y + resetLabel.height) * 0.5 - 4, 'buttonSmall', 'reset', 22)
    this.resetBtn.onInputUp.addOnce(this.confirmReset, this)

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  confirmReset () {
    this.resetBtn.text = 'confirm'
    this.resetBtn.onInputUp.addOnce(this.reset, this)
  }

  reset () {
    this.game.idle.reset()
  }
}

module.exports = Stats
