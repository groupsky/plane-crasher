/* global Phaser */

const webFontLoader = require('webfontloader')

class Preload extends Phaser.State {
  init () {
    this.stage.disableVisibilityChange = true
  }

  preload () {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'preload')

    this.preloadBar.anchor.set(0.5)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('logo', 'img/logo.png')
    this.load.atlas('sheet', 'img/sheet.png', 'img/sheet.json')
    this.load.image('barShadowLeft', 'img/barHorizontal_shadow_left.png')
    this.load.image('barShadowMid', 'img/barHorizontal_shadow_mid.png')
    this.load.image('barShadowRight', 'img/barHorizontal_shadow_right.png')
    this.load.image('barBlueLeft', 'img/barHorizontal_blue_left.png')
    this.load.image('barBlueMid', 'img/barHorizontal_blue_mid.png')
    this.load.image('barBlueRight', 'img/barHorizontal_blue_right.png')
    this.load.bitmapFont('kenvector12', 'assets/kenvector-12.png', 'assets/kenvector-12.fnt')
    this.load.bitmapFont('kenvector14red', 'assets/kenvector-14-red.png', 'assets/kenvector-14.fnt')
    this.load.bitmapFont('kenvectorthin12', 'assets/kenvector-thin-12.png', 'assets/kenvector-thin-12.fnt')
    this.load.bitmapFont('kenvectorthin14', 'assets/kenvector-thin-14.png', 'assets/kenvector-thin-14.fnt')
    this.load.bitmapFont('kenvectorthin14red', 'assets/kenvector-thin-14-red.png', 'assets/kenvector-thin-14.fnt')
    this.load.bitmapFont('kenvectorthin18', 'assets/kenvector-thin-18.png', 'assets/kenvector-thin-18.fnt')
    this.load.bitmapFont('kenvectorthin18white', 'assets/kenvector-thin-18-white.png', 'assets/kenvector-thin-18-white.fnt')
    this.load.bitmapFont('kenvectorthin24', 'assets/kenvector-thin-24.png', 'assets/kenvector-thin-24.fnt')
    this.load.bitmapFont('kenvectorthin24white', 'assets/kenvector-thin-24-white.png', 'assets/kenvector-thin-24-white.fnt')
    this.load.bitmapFont('kenvectorthin28', 'assets/kenvector-thin-28.png', 'assets/kenvector-thin-28.fnt')
    this.load.bitmapFont('kenvector16', 'assets/kenvector-16.png', 'assets/kenvector-16.fnt')
    this.load.bitmapFont('kenvector28', 'assets/kenvector-28.png', 'assets/kenvector-28.fnt')
    this.load.bitmapFont('kenvector72', 'assets/kenvector-72.png', 'assets/kenvector-72.fnt')
    this.load.atlas('ui', 'img/ui.png', 'img/ui.json')

    //load audio assets
    this.load.audio('jump', ['assets/jump.ogg'])
    this.load.audio('click', ['assets/click.ogg'])

    // load web fonts
    this.webfontsReady = false
    webFontLoader.load({
      inactive: () => this.webfontsReady = true,
      active: () => this.webfontsReady = true,
      custom: {
        families: [ 'kenvector_future', 'kenvector_future_thin' ],
        urls: [ 'css/fonts.css' ]
      }
    })
  }

  create () {
    const chars = [
      {
        _id: 32,
        _x: 0,
        _y: 0,
        _width: 0,
        _height: 0,
        _xadvance: 48,
        _xoffset: 0,
        _yoffset: 0
      }
    ]
    const sheetInfo = this.cache.getFrameData('sheet')
    sheetInfo._frames.forEach((frame) => {
      if (frame.name.indexOf('letter') === 0) {
        chars.push({
          _id: frame.name.charCodeAt(6),
          _x: frame.x,
          _y: frame.y,
          _width: frame.width,
          _height: frame.height,
          _xadvance: frame.width,
          _xoffset: 0,
          _yoffset: 0
        })
        chars.push({
          _id: frame.name.toLowerCase().charCodeAt(6),
          _x: frame.x,
          _y: frame.y,
          _width: frame.width,
          _height: frame.height,
          _xadvance: frame.width,
          _xoffset: 0,
          _yoffset: 0
        })
      } else if (frame.name.indexOf('number') === 0) {
        chars.push({
          _id: frame.name.charCodeAt(6),
          _x: frame.x,
          _y: frame.y,
          _width: frame.width,
          _height: frame.height,
          _xadvance: frame.width,
          _xoffset: 0,
          _yoffset: 0
        })
      }
    })
    const fontData = {
      font: {
        info: {
          _face: 'font',
          _size: 64,
          _bold: 0,
          _italic: 0,
          _stretchH: 100,
          _smooth: 1,
          _aa: 1,
          _padding: '2,2,2,2',
          _spacing: '0,0',
          _outline: 0
        },
        common: {
          _lineHeight: 80,
          _base: 52,
          _scaleW: 79,
          _scaleH: 454,
          _pages: 1,
          _packed: 0
        },
        chars: {
          _count: 0,
          char: chars
        },
        kernings: {
          _count: 1,
          kerning: [ {
            _first: 49,
            _second: 49,
            _amount: -5
          } ]
        }
      }
    }
    this.cache.addJSON('Font', null, fontData)
    this.cache.addBitmapFontFromAtlas('font', 'sheet', 'all', 'Font', 'json')
  }

  update () {
    if (this.webfontsReady) {
      this.game.submitLoaded()
      this.state.start('MainMenu')
    }
  }

  render () { }

  shutdown () {
    this.stage.disableVisibilityChange = false
  }
}

module.exports = Preload
