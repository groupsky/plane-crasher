/* global Phaser, SlickUI */

const Button = require('../ui/Button')
const Plane = require('../actors/Plane')
const TopBar = require('../actors/TopBar')

class MainMenu extends Phaser.State {
  preload () { }

  create () {
    const topBar = new TopBar(this.game)
    this.add.existing(topBar)

    // scrolling background
    this.background = this.add.tileSprite(0, 40, this.world.width, this.world.height / 3, 'sheet', 'background')
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

    const lastLabel = this.add.text(this.world.width - 100, 500, 'last: ' + ((this.game.idle.idleEngine.recordings.items[0] || {}).score || 0), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    })
    lastLabel.position.x -= lastLabel.width

    // this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
    // this.actionKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    // this.actionKey.onDown.add(this.startGame, this)
    // this.input.onTap.add(this.startGame, this)
    // this.input.onDown.add(this.startGame, this)

    // this.startBtn = this.game.add.button(this.world.centerX, 400, 'sheet', this.startGame, this, 'buttonSmall')
    // this.startBtn.anchor.set(0.5)
    this.startBtn = new Button(this.game, this.world.centerX, 410, 'buttonSmall')
    this.startBtn.onInputUp.add(this.startGame, this)

    this.startBtnLabel = this.add.text(this.world.centerX, 410, 'play', {
      font: '28px kenvector_future',
      fill: '#000000',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    })
    this.startBtnLabel.anchor.set(0.5)

    this.upgradesBtn = new Button(this.game, this.world.centerX, 520, 'buttonLarge')
    this.upgradesBtn.onInputUp.add(() => this.game.state.start('Upgrades'))

    this.upgradesBtnLabel = this.add.text(this.world.centerX, 520, 'upgrade', {
      font: '28px kenvector_future',
      fill: '#000000',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    })
    this.upgradesBtnLabel.anchor.set(0.5)

    const fullBtn = new Button(this.game, this.world.width, this.world.height, 'buttonSmall')
    fullBtn.onInputUp.add(() => {
      if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen()
      } else {
        this.game.scale.startFullScreen(false)
      }
    })
    fullBtn.scale.set(0.25)
    fullBtn.x -= fullBtn.width - 8
    fullBtn.y -= fullBtn.height - 8
    fullBtn.text = 'f'
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
