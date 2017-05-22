/* global Phaser */

const IdlePlugin = require('./IdlePlugin')
const Boot = require('./states/Boot')
const Main = require('./states/Main')
const MainMenu = require('./states/MainMenu')
const Preload = require('./states/Preload')
const GameOver = require('./states/GameOver')
const Upgrades = require('./states/Upgrades')
const Stats = require('./states/Stats')
const Bots = require('./states/Bots')

class Game extends Phaser.Game {
  constructor () {
    let engine = Phaser.AUTO

    if (window.Cocoon) {
      if (window.Cocoon.nativeAvailable()) {
        console.log('cocoon native available, webgl', window.Cocoon.Utils.isWebGLEnabled())
        engine = Phaser.CANVAS
        if (window.Cocoon.Utils.isWebGLEnabled()) {
          window.Cocoon.Utils.setWebGLEnabled(false)
        }
      } else {
        console.log('no native')
      }
    } else {
      console.log('no cocoon')
    }

    const scale = 480 / window.innerHeight
    console.log('scaling at', scale)

    super({
      width: window.innerWidth * scale,
      height: window.innerHeight * scale,
      renderer: engine,
      antialias: false,
      enableDebug: process.env.NODE_ENV !== 'production'
    })

    this.isBrowser = !window.Cocoon || !window.Cocoon.nativeAvailable()

    this.idle = this.plugins.add(IdlePlugin.configure(), 'crashyplane')
    if (this.isBrowser) {
      this.saveCpu = this.plugins.add(Phaser.Plugin.SaveCPU)
      this.saveCpu.renderOnFPS = 15
    }

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
    this.state.add('Upgrades', Upgrades, false)
    this.state.add('Stats', Stats, false)
    this.state.add('Bots', Bots, false)
  }
}

module.exports = Game
