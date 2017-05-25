/* global Phaser, SlickUI */

const Button = require('../ui/Button')
const Plane = require('../actors/Plane')
const TopBar = require('../actors/TopBar')
const IdleGains = require('../actors/IdleGains')
const styles = require('../ui/styles')

class MainMenu extends Phaser.State {
  preload () { }

  create () {
    const topBar = new TopBar(this.game)

    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.autoScroll(-100, 0)

    this.logo = new Plane(this.game, this.world.centerX, 80, 'planeGreen')
    this.logo.anchor.set(0.5)
    this.logo.position.y += this.logo.height / 2
    this.logo.angle = -20
    this.add.tween(this.logo).to({ angle: 20 }, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)
    this.add.existing(this.logo)

    let titleText = this.add.text(this.world.centerX, 200, 'Crashy Plane', {
      font: '65px kenvector_future_thin',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    })
    titleText.anchor.set(0.5)
    titleText.font = 'kenvector_future_thin'
    titleText.fontSize = 65

    this.startBtn = new Button(this.game, this.world.width / 4, 300, 'Play', styles.btnLarge)
    this.startBtn.onInputUp.add(this.startGame, this)

    this.upgradesBtn = new Button(this.game, this.world.width / 4, 400, 'Upgrade', styles.btnLarge)
    this.upgradesBtn.onInputUp.add(() => this.game.state.start('Upgrades'))

    this.botsBtn = new Button(this.game, this.world.width * 3 / 4, 300, 'Bots', styles.btnLarge)
    this.botsBtn.onInputUp.add(() => this.game.state.start('Bots'))

    this.statsBtn = new Button(this.game, this.world.width * 3 / 4, 400, 'Stats', styles.btnLarge)
    this.statsBtn.onInputUp.add(() => this.game.state.start('Stats'))

    if (this.game.isBrowser) {
      const fullBtn = new (require('../ui/ButtonFont'))(this.game, this.world.width, this.world.height, 'buttonSmall', 'F', 40)
      fullBtn.onInputUp.add(() => {
        if (this.game.scale.isFullScreen) {
          this.game.scale.stopFullScreen()
        } else {
          this.game.scale.startFullScreen(false)
        }
      })
      fullBtn.scale.set(0.15, 0.25)
      fullBtn.x -= fullBtn.width - 8
      fullBtn.y -= fullBtn.height - 8
    }

    if (this.game.idle.idleEngine.idleGain) {
      this.startBtn.visible = false
      this.upgradesBtn.visible = false
      this.botsBtn.visible = false
      this.statsBtn.visible = false
      this.idleGains = new IdleGains(this.game, undefined, this.world.centerX, this.world.centerY)
      this.add.existing(this.idleGains)
      this.idleGains.onContinue.add(() => {
        this.idleGains.destroy()
        this.startBtn.visible = true
        this.upgradesBtn.visible = true
        this.game.idle.idleEngine.idleGain = false
        this.botsBtn.visible = true
        this.statsBtn.visible = true
      })
    }

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  render () { }

  shutdown () {
    this.logo.destroy()
    this.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
  }

  startGame () {
    this.game.state.start('Main')
  }
}

module.exports = MainMenu
