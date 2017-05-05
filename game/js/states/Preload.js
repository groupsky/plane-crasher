class Preload extends Phaser.State {

  preload () {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'preload')

    this.preloadBar.anchor.set(.5)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('logo', 'img/logo.png')
    this.load.atlasXML('sheet', 'img/sheet.png', 'img/sheet.xml')
    this.load.xml('Font', 'fonts/font.xml')
  }

  create () {
    this.cache.addBitmapFontFromAtlas('font', 'sheet', 'all', 'Font')
    
    // this.state.start('MainMenu')
    this.state.start('Main')
  }

  update () { }

  render () { }
}

module.exports = Preload
