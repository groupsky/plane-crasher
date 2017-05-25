/* global Phaser, SlickUI */

const Button = require('../ui/ButtonFont')
const TopBar = require('../actors/TopBar')
const UpgradePanel = require('../ui/UpgradePanel')

class Upgrades extends Phaser.State {
  create () {

    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.autoScroll(-100, 0)

    const topBar = new TopBar(this.game)
    topBar.title = 'Upgrades'
    topBar.backEnabled = true
    this.add.existing(topBar)

    this.buyBotPanel = new UpgradePanel(this.game, 18, 66)
    this.add.existing(this.buyBotPanel)
    // this.buyBotPanel.icon = 'robot'
    this.buyBotPanel.description = 'Continuously generate gold \nbased on your best score at the moment \nof purchase'
    this.buyBotPanel.price = this.game.idle.idleEngine.botCost(1)
    this.buyBotPanel.title = 'Bot'
    this.buyBotPanel.onClick = () => {
      this.game.idle.idleEngine.buyBot(1)
      this.buyBotPanel.price = this.game.idle.idleEngine.botCost(1)
    }

    this.buyRocketPanel = new UpgradePanel(this.game, this.world.centerX + 9, 66)
    this.add.existing(this.buyRocketPanel)
    // this.buyRocketPanel.icon = 'rocket'
    this.buyRocketPanel.description = 'This is sample description for the \nrocket upgrade separated \non 3 lines'
    this.buyRocketPanel.price = this.game.idle.idleEngine.rocketCost(1)
    this.buyRocketPanel.title = "Rocket"
    this.buyRocketPanel.onClick = () => {
      this.game.idle.idleEngine.buyRocket(1)
      this.buyRocketPanel.price = this.game.idle.idleEngine.rocketCost(1)
    }

    this.buyDistancePanel = new UpgradePanel(this.game, 18, 204)
    this.add.existing(this.buyDistancePanel)
    // this.buyDistancePanel.icon = 'rocket'
    this.buyDistancePanel.description = 'This is sample description for the \ndistance upgrade separated \non 3 lines'
    this.buyDistancePanel.price = this.game.idle.idleEngine.distancePointsCost(1)
    this.buyDistancePanel.title = "Distance"
    this.buyDistancePanel.onClick = () => {
      this.game.idle.idleEngine.buyDistancePoints(1)
      this.buyDistancePanel.price = this.game.idle.idleEngine.distancePointsCost(1)
    }


    this.buyObstaclePanel = new UpgradePanel(this.game, this.world.centerX + 9, 204)
    this.add.existing(this.buyObstaclePanel)
    // this.buyObstaclePanel.icon = 'rocket'
    this.buyObstaclePanel.description = 'This is sample description for the \nobstacle upgrade separated \non 3 lines'
    this.buyObstaclePanel.price = this.game.idle.idleEngine.obstaclePointsCost(1)
    this.buyObstaclePanel.title = "Obstacle"
    this.buyObstaclePanel.onClick = () => {
      this.game.idle.idleEngine.buyObstaclePoints(1)
      this.buyObstaclePanel.price = this.game.idle.idleEngine.obstaclePointsCost(1)
    }

    this.buyJumpPanel = new UpgradePanel(this.game, 18, 342)
    this.add.existing(this.buyJumpPanel)
    // this.buyJumpPanel.icon = 'rocket'
    this.buyJumpPanel.description = 'This is sample description for the \njump upgrade separated \non 3 lines'
    this.buyJumpPanel.price = this.game.idle.idleEngine.jumpPrecisionCost(1)
    this.buyJumpPanel.title = "Jump"
    this.buyJumpPanel.onClick = () => {
      this.game.idle.idleEngine.buyJumpPrecision(1)
      this.buyJumpPanel.price = this.game.idle.idleEngine.jumpPrecisionCost(1)
    }

    this.buySpeedPanel = new UpgradePanel(this.game, this.world.centerX + 9, 342)
    this.add.existing(this.buySpeedPanel)
    // this.buySpeedPanel.icon = 'speed'
    this.buySpeedPanel.description = 'This is sample description for the \nspeed upgrade separated \non 3 lines'
    this.buySpeedPanel.price = this.game.idle.idleEngine.speedCost(1)
    this.buySpeedPanel.title = "Speed"
    this.buySpeedPanel.onClick = () => {
      this.game.idle.idleEngine.buySpeed(1)
      this.buySpeedPanel.price = this.game.idle.idleEngine.speedCost(1)
    }

  }

}

module.exports = Upgrades
