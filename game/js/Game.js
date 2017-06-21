/* global Phaser,ga */

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

    super({
      width: Math.max(640, 480 * window.innerWidth / window.innerHeight),
      height: 480,
      renderer: engine,
      antialias: false,
      enableDebug: process.env.NODE_ENV !== 'production'
    })

    this.isCocoon = window.Cocoon && window.Cocoon.nativeAvailable()
    this.isBrowser = !window.Cocoon || !window.Cocoon.nativeAvailable()
    this.isKongregate = /\bkongregate\b/.test(window.location.search)

    this.idle = this.plugins.add(IdlePlugin.configure(), 'crashyplane')
    if (this.isBrowser) {
      this.saveCpu = this.plugins.add(Phaser.Plugin.SaveCPU)
      this.saveCpu.renderOnFPS = 30
    }
    if (this.isKongregate) {
      this.kongregate = this.plugins.add(require('./KongregatePlugin').configure())
    }
    
    this.ads = this.plugins.add(require('./AdMobPlugin').configure())
    
    this.stage.backgroundColor = 0x000000

    this.scale.forceOrientation(true)
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

    // this.scale.setMinMax(640, 480, undefined, 480)

    this.scale.pageAlignVertically = true
    this.scale.pageAlignHorizontally = true

    // this.scale.onSizeChange.add(() => {
    //   console.log('onSizeChange', window.innerWidth, window.innerHeight)
    //   this.scale.setGameSize(Math.max(640, 480 * window.innerWidth / window.innerHeight), 480)
    //   this.renderer.resize(Math.max(640, 480 * window.innerWidth / window.innerHeight), 480)
    //   const targetWidth = Math.max(640, window.innerWidth * 480 / window.innerHeight)
    //   const targetHeight = 480
    //   const scale = Math.min(window.innerWidth / targetWidth, window.innerHeight / targetHeight)
    //   this.scale.setGameSize(targetWidth, targetHeight)
    //   this.scale.setUserScale(scale, scale)
    //   // scale.parentScaleFactor.set()
    // })
    // window.onresize = () => {
    //   console.log('onresize', window.innerWidth, window.innerHeight)
    //   this.scale.setGameSize(Math.max(640, 480 * window.innerWidth / window.innerHeight), 480)
    //   this.renderer.resize(Math.max(640, 480 * window.innerWidth / window.innerHeight), 480)
    // }
    // this.scale.onFullScreenInit.add(() => {
    //   console.log('onFullScreenInit', window.innerHeight)
    //   this.scale.setGameSize(window.innerWidth * 480 / window.innerHeight, 480)
    // })

    this.state.add('Boot', Boot, false)
    this.state.add('Preload', Preload, false)
    this.state.add('MainMenu', MainMenu, false)
    this.state.add('Main', Main, false)
    this.state.add('GameOver', GameOver, false)
    this.state.add('Upgrades', Upgrades, false)
    this.state.add('Stats', Stats, false)
    this.state.add('Bots', Bots, false)

    this.device.whenReady(this.submitStats, this)
  }

  submitLoaded () {
    if (this.isKongregate) {
      this.kongregate.submitStat('initialized', 1)
    }
    ga('send', 'pageview')
  }

  submitStats () {
    const idle = this.idle.idleEngine
    if (this.isKongregate) {
      this.kongregate.submitStats({
        bots: idle.bots.items.length,
        bestScore: Math.floor(idle.stats.best.score),
        bestTime: Math.floor(idle.stats.best.time * 1000),
        bestDistance: Math.floor(idle.stats.best.distance),
        bestObstacles: Math.floor(idle.stats.best.obstacles),
        totalPlays: idle.stats.totals.plays,
        totalPlayTime: Math.floor(idle.stats.totals.stats.time / 60),
        totalObstacles: idle.stats.totals.stats.obstacles,
        totalDistance: Math.floor(idle.stats.totals.stats.distance / 1000),
        totalTurbo: idle.stats.totals.stats.turbo,
        totalJumps: idle.stats.totals.stats.jumps,
      })
    }
  }
}

module.exports = Game
