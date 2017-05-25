/* global Phaser */

const formatNumber = require('../utils').formatNumber
const formatDuration = require('../utils').formatDuration
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
      font: '16px kenvector_future_thin',
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
      font: '14px kenvector_future_thin',
      fill: '#c33',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    }

    const idle = this.game.idle.idleEngine
    const stats = idle.stats
    const totalsTitle = this.add.text(panelLeft.x + panelLeft.width * 0.5, panelLeft.y + 6, 'Totals', titleStyle)
    totalsTitle.anchor.set(0.5, 0)
    this.add.text(panelLeft.x + 16, panelLeft.y + 8 + totalsTitle.height, [
      'plays: ' + formatNumber(stats.totals.plays),
      'total time: ' + formatDuration(stats.totals.stats.time * 1000),
      'obstacles: ' + formatNumber(stats.totals.stats.obstacles),
      'distance: ' + formatNumber(stats.totals.stats.distance, formatNumber.distance),
      'turbo used: ' + formatNumber(stats.totals.stats.turbo),
      'turbo time: ' + formatDuration(stats.totals.stats.turboTime * 1000, 'N/A'),
      'jumps: ' + formatNumber(stats.totals.stats.jumps),
      '',
      'obstacle score: ' + formatNumber(stats.totals.scores.obstacles, formatNumber.gold),
      'distance score: ' + formatNumber(stats.totals.scores.distance, formatNumber.gold),
      'total score: ' + formatNumber(stats.totals.scores.total, formatNumber.gold),
      '',
      'gold earned: ' + formatNumber(stats.totals.gold.earned, formatNumber.gold),
      'bots earned: ' + formatNumber(stats.totals.gold.bots, formatNumber.gold),
      'total gold: ' + formatNumber(Math.floor(stats.totals.gold.earned) + Math.floor(stats.totals.gold.bots), formatNumber.gold),
    ].join('\n'), statStyle)

    const highscoreTitle = this.add.text(panelRightTop.x + panelRightTop.width * 0.5, panelRightTop.y + 8, 'Highscore', titleStyle)
    highscoreTitle.anchor.set(0.5, 0)
    this.add.text(panelRightTop.x + 16, panelRightTop.y + 12 + highscoreTitle.height, [
      'score: ' + formatNumber(stats.best.score, formatNumber.gold),
      'time: ' + formatDuration(stats.best.time * 1000),
      'distance: ' + formatNumber(stats.best.distance, formatNumber.distance),
      'obstacles: ' + formatNumber(stats.best.obstacles)
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
