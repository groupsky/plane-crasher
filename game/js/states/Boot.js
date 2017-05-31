/* global Phaser */

class Boot extends Phaser.State {
  init () {
    this.stage.disableVisibilityChange = true
  }

  preload () {
    this.load.image('preload', 'img/preload.png')
  }

  create () {
    this.input.maxPointers = 1
    this.state.start('Preload')
  }

  update () { }

  render () { }

  shutdown () {
    this.stage.disableVisibilityChange = false
  }
}

module.exports = Boot
