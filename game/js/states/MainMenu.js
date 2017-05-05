/* global Phaser */

class MainMenu extends Phaser.State {
  preload () { }

  create () {
    let logo = this.add.image(this.world.centerX, 138, 'logo')
    logo.anchor.set(0.5)

    let titleText = this.add.text(this.world.centerX, 300, 'Plane Crasher', {
      font: '65px kenvector_future_thin',
      fill: '#ffffff',
      align: 'center'
    })
    titleText.anchor.set(0.5)
    titleText.font = 'kenvector_future_thin'
    titleText.fontSize = 65

    let instructionsText = this.add.text(this.world.centerX, 400, 'Click anywhere to play', {
      font: '16px kenvector_future_thin',
      fill: '#ffffff',
      align: 'center'
    })
    instructionsText.anchor.set(0.5)

    this.add.text(100, 500, 'best: ' + (window.localStorage.getItem('best') || 0), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'left'
    })

    this.add.text(this.world.width - 100, 500, 'last: ' + (window.localStorage.getItem('score') || 0), {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right'
    })

    logo.angle = -20
    this.add.tween(logo).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)

    this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
    this.actionKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.actionKey.onDown.add(this.startGame, this)
    this.input.onTap.add(this.startGame, this)
    this.input.onDown.add(this.startGame, this)
  }

  update () { }

  render () { }

  shutdown () {
    this.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
  }

  startGame () {
    this.game.state.start('Main')
  }
}

module.exports = MainMenu
