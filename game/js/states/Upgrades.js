/* global Phaser, SlickUI */

const Button = require('../ui/ButtonFont')
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

    this.buyBotBtn = new Button(this.game, 120, 200, 'buttonLarge',
      'bot ' + this.game.idle.idleEngine.botCost(1), 14)
    this.add.existing(this.buyBotBtn)
    this.buyBotBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buyBot(1)
      this.buyBotBtn.text = 'bot ' + this.game.idle.idleEngine.botCost(1)
    })

    this.buyRocketBtn = new Button(this.game, 120, 300, 'buttonLarge',
      'rocket ' + this.game.idle.idleEngine.rocketCost(1), 14)
    this.add.existing(this.buyRocketBtn)
    this.buyRocketBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buyRocket(1)
      this.buyRocketBtn.text = 'rocket ' + this.game.idle.idleEngine.rocketCost(1)
    })

    this.buyDistanceBtn = new Button(this.game, 360, 200, 'buttonLarge',
      'dist ' + this.game.idle.idleEngine.distancePointsCost(1), 14)
    this.add.existing(this.buyDistanceBtn)
    this.buyDistanceBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buyDistancePoints(1)
      this.buyDistanceBtn.text = 'dist ' + this.game.idle.idleEngine.distancePointsCost(1)
    })

    this.buyObstacleBtn = new Button(this.game, 360, 300, 'buttonLarge',
      'obst ' + this.game.idle.idleEngine.obstaclePointsCost(1), 14)
    this.add.existing(this.buyObstacleBtn)
    this.buyObstacleBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buyObstaclePoints(1)
      this.buyObstacleBtn.text = 'obst ' + this.game.idle.idleEngine.obstaclePointsCost(1)
    })

    this.buyJumpBtn = new Button(this.game, 600, 200, 'buttonLarge',
      'jump ' + this.game.idle.idleEngine.jumpPrecisionCost(1), 14)
    this.add.existing(this.buyJumpBtn)
    this.buyJumpBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buyJumpPrecision(1)
      this.buyJumpBtn.text = 'jump ' + this.game.idle.idleEngine.jumpPrecisionCost(1)
    })

    this.buySpeedBtn = new Button(this.game, 600, 300, 'buttonLarge',
      'speed ' + this.game.idle.idleEngine.speedCost(1), 14)
    this.add.existing(this.buySpeedBtn)
    this.buySpeedBtn.onInputUp.add(() => {
      this.game.idle.idleEngine.buySpeed(1)
      this.buySpeedBtn.text = 'speed ' + this.game.idle.idleEngine.speedCost(1)
    })

    this.backBtn = new Button(this.game, 120, 200, 'buttonSmall', 'back', 14)
    this.add.existing(this.backBtn)
    this.backBtn.onInputUp.add(() => this.game.state.start('MainMenu'))
    this.backBtn.position.x = this.backBtn.width
    this.backBtn.position.y = this.world.height - this.backBtn.height
  }

}

module.exports = Upgrades
