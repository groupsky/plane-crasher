/* global Phaser */

class Label extends Phaser.Group {
  constructor (game, x, y, text, style, parent) {
    super(game, parent, 'label')

    const size = (style && style.size) || 72

    if (style.bitmap) {
      this._label = this.game.add.bitmapText(0, 0, style.font, text, size, this)
      this._label.align = style.align || 'center'

      if (style.color) {
        let color = style.color.substr(1)
        switch (color.length) {
          case 3:
            color = color[ 0 ] + color[ 0 ] + color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ]
            break
          case 6:
            break
          default:
            throw new Error('unhandled color: ' + style.color)
        }

        this._label.tint = parseInt(color, 16)
      }
    } else {
      this._label = this.game.add.text(0, 0, text, {
        font: size + 'px ' + style.font,
        fill: style.color || '#333',
        align: style.align || 'center',
        boundsAlignH: style.boundsAlignH || 'center',
        boundsAlignV: style.boundsAlignV || 'center',
      }, this)
    }

    this.x = x
    this.y = y
  }

  get align () { return this._label.align }

  set align (value) { this._label.align = value }

  get anchor () { return this._label.anchor }

  get text () {
    return this._label.text
  }

  set text (value) {
    this._label.text = value
  }
}

module.exports = Label
