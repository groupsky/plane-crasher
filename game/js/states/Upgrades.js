/* global Phaser, SlickUI */

const Button = require('../ui/Button')
const TopBar = require('../actors/TopBar')

class Upgrades extends Phaser.State {
  create () {

    const topBar = new TopBar(this.game)
    this.add.existing(topBar)

    const title = this.add.text(this.world.centerX, 100, 'Upgrades', {
      font: '32px kenvector_future',
      fill: '#ffffff',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    })
    title.anchor.set(0.5, 0)

    this.buyBotBtn = new Button(this.game, 120, 200, 'buttonLarge.png')
    this.buyBotBtn.onInputUp.add(this.buyBot, this)

    this.buyBotBtnLabel = this.add.text(
      this.buyBotBtn.position.x + this.buyBotBtn.width / 2,
      this.buyBotBtn.position.y + this.buyBotBtn.height / 2,
      'buy bot ' + this.game.idle.idleEngine.botCost(1), {
        font: '14px kenvector_future',
        fill: '#000000',
        align: 'center',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
      })
    this.buyBotBtnLabel.anchor.set(0.5)

    this.buyRocketBtn = new Button(this.game, 120, 300, 'buttonLarge.png')
    this.buyRocketBtn.onInputUp.add(this.buyRocket, this)

    this.buyRocketBtnLabel = this.add.text(
      this.buyRocketBtn.position.x + this.buyRocketBtn.width / 2,
      this.buyRocketBtn.position.y + this.buyRocketBtn.height / 2,
      'buy rocket ' + this.game.idle.idleEngine.rocketCost(1), {
        font: '14px kenvector_future',
        fill: '#000000',
        align: 'center',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
      })
    this.buyRocketBtnLabel.anchor.set(0.5)

    this.backBtn = new Button(this.game, 120, 200, 'buttonSmall.png')
    this.backBtn.onInputUp.add(() => this.game.state.start('MainMenu'))
    this.backBtn.position.x = this.backBtn.width
    this.backBtn.position.y = this.world.height - this.backBtn.height

    this.backBtnLabel = this.add.text(
      this.backBtn.position.x + this.backBtn.width / 2,
      this.backBtn.position.y + this.backBtn.height / 2,
      'back', {
        font: '14px kenvector_future',
        fill: '#000000',
        align: 'center',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
      })
    this.backBtnLabel.anchor.set(0.5)
  }

  buyBot () {
    this.game.idle.idleEngine.buyBot(1)
  }
  buyRocket () {
    this.game.idle.idleEngine.buyRocket(1)
  }

}

module.exports = Upgrades
