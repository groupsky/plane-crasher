class Boot extends Phaser.State {

  preload () {
    this.load.image('preload', 'img/preload.png')
  }

  create () {
    this.input.maxPointers = 1
    this.state.start('Preload')
  }

  update () { }

  render () { }
}

module.exports = Boot
