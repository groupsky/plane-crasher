/* global Phaser */

const Boot = require('./states/Boot')
const Main = require('./states/Main')
const MainMenu = require('./states/MainMenu')
const Preload = require('./states/Preload')
const GameOver = require('./states/GameOver')

class Game extends Phaser.Game {
  constructor () {
    super(800, 600, Phaser.AUTO)

    this.stage.backgroundColor = 0x000000

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

    // this.scale.setMinMax(800, 600)

    this.scale.pageAlignVertically = true
    this.scale.pageAlignHorizontally = true

    this.state.add('Boot', Boot, false)
    this.state.add('Preload', Preload, false)
    this.state.add('MainMenu', MainMenu, false)
    this.state.add('Main', Main, false)
    this.state.add('GameOver', GameOver, false)
  }
}

module.exports = Game
