/* global Phaser, SlickUI */

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

    this.buyBotPanel = new UpgradePanel(this.game, 16, topBar.height + 16)
    this.add.existing(this.buyBotPanel)
    // this.buyBotPanel.icon = 'robot'
    this.buyBotPanel.description = 'Continuously generate gold \nbased on your best score at the moment \nof purchase'
    this.buyBotPanel.price = this.game.idle.idleEngine.botCost(1)
    this.buyBotPanel.title = 'Bot'
    this.buyBotPanel.level = this.game.idle.idleEngine.botLevel()
    this.buyBotPanel.onClick = () => {
      this.game.idle.idleEngine.buyBot(1)
      this.buyBotPanel.price = this.game.idle.idleEngine.botCost(1)
      this.buyBotPanel.level = this.game.idle.idleEngine.botLevel()
    }

    this.buyRocketPanel = new UpgradePanel(this.game, this.world.centerX + 8, topBar.height + 16)
    this.add.existing(this.buyRocketPanel)
    // this.buyRocketPanel.icon = 'rocket'
    this.buyRocketPanel.description = 'This is sample description for the \nrocket upgrade separated \non 3 lines'
    this.buyRocketPanel.price = this.game.idle.idleEngine.rocketCost(1)
    this.buyRocketPanel.title = 'Rocket'
    this.buyRocketPanel.onClick = () => {
      this.game.idle.idleEngine.buyRocket(1)
      this.buyRocketPanel.price = this.game.idle.idleEngine.rocketCost(1)
    }

    this.buyDistancePanel = new UpgradePanel(this.game, 16, this.buyBotPanel.y + this.buyBotPanel.height + 16)
    this.add.existing(this.buyDistancePanel)
    // this.buyDistancePanel.icon = 'rocket'
    this.buyDistancePanel.description = 'This is sample description for the \ndistance upgrade separated \non 3 lines'
    this.buyDistancePanel.price = this.game.idle.idleEngine.distancePointsCost(1)
    this.buyDistancePanel.title = 'Distance'
    this.buyDistancePanel.level = this.game.idle.idleEngine.distancePointsLevel()
    this.buyDistancePanel.onClick = () => {
      this.game.idle.idleEngine.buyDistancePoints(1)
      this.buyDistancePanel.price = this.game.idle.idleEngine.distancePointsCost(1)
      this.buyDistancePanel.level = this.game.idle.idleEngine.distancePointsLevel()
    }

    this.buyObstaclePanel = new UpgradePanel(this.game, this.world.centerX + 8, this.buyRocketPanel.y + this.buyRocketPanel.height + 16)
    this.add.existing(this.buyObstaclePanel)
    // this.buyObstaclePanel.icon = 'rocket'
    this.buyObstaclePanel.description = 'This is sample description for the \nobstacle upgrade separated \non 3 lines'
    this.buyObstaclePanel.price = this.game.idle.idleEngine.obstaclePointsCost(1)
    this.buyObstaclePanel.title = 'Obstacle'
    this.buyObstaclePanel.level = this.game.idle.idleEngine.obstaclePointsLevel()
    this.buyObstaclePanel.onClick = () => {
      this.game.idle.idleEngine.buyObstaclePoints(1)
      this.buyObstaclePanel.price = this.game.idle.idleEngine.obstaclePointsCost(1)
      this.buyObstaclePanel.level = this.game.idle.idleEngine.obstaclePointsLevel()
    }

    this.buyJumpPanel = new UpgradePanel(this.game, 16, this.buyDistancePanel.y + this.buyDistancePanel.height + 16)
    this.add.existing(this.buyJumpPanel)
    // this.buyJumpPanel.icon = 'rocket'
    this.buyJumpPanel.description = 'This is sample description for the \njump upgrade separated \non 3 lines'
    this.buyJumpPanel.price = this.game.idle.idleEngine.jumpPrecisionCost(1)
    this.buyJumpPanel.title = 'Jump'
    this.buyJumpPanel.level = this.game.idle.idleEngine.jumpPrecisionLevel()
    this.buyJumpPanel.onClick = () => {
      this.game.idle.idleEngine.buyJumpPrecision(1)
      this.buyJumpPanel.price = this.game.idle.idleEngine.jumpPrecisionCost(1)
      this.buyJumpPanel.level = this.game.idle.idleEngine.jumpPrecisionLevel()
    }

    this.buySpeedPanel = new UpgradePanel(this.game, this.world.centerX + 8, this.buyObstaclePanel.y + this.buyObstaclePanel.height + 16)
    this.add.existing(this.buySpeedPanel)
    // this.buySpeedPanel.icon = 'speed'
    this.buySpeedPanel.description = 'Increase speed of the plane'
    this.buySpeedPanel.price = this.game.idle.idleEngine.speedCost(1)
    this.buySpeedPanel.title = 'Speed'
    this.buySpeedPanel.level = this.game.idle.idleEngine.speedLevel()
    this.buySpeedPanel.onClick = () => {
      this.game.idle.idleEngine.buySpeed(1)
      this.buySpeedPanel.price = this.game.idle.idleEngine.speedCost(1)
      this.buySpeedPanel.level = this.game.idle.idleEngine.speedLevel()
    }

  }

}

module.exports = Upgrades
