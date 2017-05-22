/* global Phaser */

const BotInfo = require('../ui/BotInfo')
const moment = require('moment')
const TopBar = require('../actors/TopBar')

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
    panelLeft.width = this.world.width / 3 - 24
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
    const idle = this.game.idle.idleEngine
    const botsTitle = this.add.text(panelLeft.x + panelLeft.width * 0.5, panelLeft.y + 6, 'Bots', titleStyle)
    botsTitle.anchor.set(0.5, 0)
    const botsTotalLabel = this.add.text(panelLeft.x + panelLeft.width - 8, panelLeft.y + panelLeft.height - 8,
      'Total: ' + Math.floor(idle.bots.items.length), statStyle
    )
    botsTotalLabel.anchor.set(1, 1)

    let y = botsTitle.y + botsTitle.height + 8
    for (let i = 0; i < idle.bots.items.length; i++) {
      const botInfo = new BotInfo(this.game, panelLeft.x + 8, y, panelLeft.width - 16, idle.bots.items[ i ])
      this.add.existing(botInfo)
      y += botInfo.height
    }

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }
}

module.exports = Bots
