/* global Phaser */

const webFontLoader = require('webfontloader')

class Preload extends Phaser.State {
  preload () {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'preload')

    this.preloadBar.anchor.set(0.5)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('logo', 'img/logo.png')
    this.load.atlasXML('sheet', 'img/sheet.png', 'img/sheet.xml')
    this.load.xml('Font', 'fonts/font.xml')

    // load web fonts
    this.webfontsReady = false
    webFontLoader.load({
      active: () => {
        this.webfontsReady = true
      },
      custom: {
        families: [ 'kenvector_future', 'kenvector_future_thin' ],
        urls: [ '/css/fonts.css' ]
      }
    })
  }

  create () {
    this.cache.addBitmapFontFromAtlas('font', 'sheet', 'all', 'Font')
  }

  update () {
    if (this.webfontsReady) {
      this.state.start('MainMenu')
      // this.state.start('Main')
    }
  }

  render () { }
}

module.exports = Preload
