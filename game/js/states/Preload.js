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
    this.load.atlas('sheet', 'img/sheet.png', 'img/sheet.json')

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
      this.state.start('MainMenu')
    }
  }

  render () { }
}

module.exports = Preload
