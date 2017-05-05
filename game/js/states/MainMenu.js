/* global Phaser */

const Button = require('../ui/Button')
const Plane = require('../actors/Plane')

class MainMenu extends Phaser.State {
  preload () { }

  create () {
    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height / 3, 'sheet', 'background.png')
    this.background.scale.setTo(this.world.height / 480)
    this.background.autoScroll(-100, 0)

    this.logo = new Plane(this.game, this.world.centerX, this.world.height / 6, 'planeGreen')
    this.logo.anchor.set(0.5)
    this.logo.position.y += this.logo.height / 2
    this.logo.angle = -20
    this.add.tween(this.logo).to({ angle: 20 }, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)
    this.add.existing(this.logo)

    let titleText = this.add.text(this.world.centerX, 300, 'Plane Crasher', {
      font: '65px kenvector_future_thin',
      fill: '#ffffff',
      align: 'center'
    })
    titleText.anchor.set(0.5)
    titleText.font = 'kenvector_future_thin'
    titleText.fontSize = 65

    this.add.text(100, 500, 'best: ' + (window.localStorage.getItem('best') || 0), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'left'
    })

    const lastLabel = this.add.text(this.world.width - 100, 500, 'last: ' + (window.localStorage.getItem('score') || 0), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right'
    })
    lastLabel.position.x -= lastLabel.width

    // this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
    // this.actionKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    // this.actionKey.onDown.add(this.startGame, this)
    // this.input.onTap.add(this.startGame, this)
    // this.input.onDown.add(this.startGame, this)

    // this.startBtn = this.game.add.button(this.world.centerX, 400, 'sheet', this.startGame, this, 'buttonSmall.png')
    // this.startBtn.anchor.set(0.5)
    this.startBtn = new Button(this.game, this.world.centerX, 400, 'buttonSmall.png')
    this.startBtn.onInputUp.add(this.startGame, this)

    this.startBtnLabel = this.add.text(this.world.centerX, 400, 'play', {
      font: '32px kenvector_future',
      fill: '#000000',
      align: 'center'
    })
    this.startBtnLabel.anchor.set(0.5)
  }

  update () { }

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
