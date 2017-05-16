/* global Phaser, SlickUI */

const Button = require('../ui/ButtonFont')
const Plane = require('../actors/Plane')
const TopBar = require('../actors/TopBar')

class MainMenu extends Phaser.State {
  preload () { }

  create () {
    const topBar = new TopBar(this.game)
    this.add.existing(topBar)

    // scrolling background
    this.background = this.add.tileSprite(0, 40, this.world.width, this.world.height / 3, 'sheet', 'background.png')
    this.background.scale.setTo(this.world.height / 480)
    this.background.autoScroll(-100, 0)

    this.logo = new Plane(this.game, this.world.centerX, this.world.height / 6, 'planeGreen')
    this.logo.anchor.set(0.5)
    this.logo.position.y += this.logo.height / 2
    this.logo.angle = -20
    this.add.tween(this.logo).to({ angle: 20 }, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)
    this.add.existing(this.logo)

    let titleText = this.add.text(this.world.centerX, 325, 'Crashy Plane BETA', {
      font: '65px kenvector_future_thin',
      fill: '#ffffff',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    })
    titleText.anchor.set(0.5)
    titleText.font = 'kenvector_future_thin'
    titleText.fontSize = 65

    const lastLabel = this.add.text(this.world.width - 100, 500, 'best: ' + (this.game.idle.idleEngine.stats.best.score), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    })
    lastLabel.position.x -= lastLabel.width

    this.startBtn = new Button(this.game, this.world.centerX, 410, 'buttonLarge.png', 'Play', 28)
    this.startBtn.onInputUp.add(this.startGame, this)

    this.upgradesBtn = new Button(this.game, this.world.centerX, 490, 'buttonLarge.png', 'Upgrade', 28)
    this.upgradesBtn.onInputUp.add(() => this.game.state.start('Upgrades'))

    const fullBtn = new Button(this.game, this.world.width, this.world.height, 'buttonSmall.png', 'F', 40)
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
