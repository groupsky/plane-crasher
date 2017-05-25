/* global Phaser */
const formatNumber = require('../utils').formatNumber
const Button = require('../ui/ButtonFont')

class TopBar extends Phaser.Group {

  constructor (game, parent) {
    super(game, parent)

    this._height = 48

    this._background = this.game.add.graphics(0, 0, this)
    this._background.beginFill(0xFFFFFF)
    this._background.drawRect(0, 0, this.game.world.width, this._height)
    this._background.endFill()
    this._background.alpha = 0.3
    this._background.visible = false
    this.add(this._background)

    this._title = this.game.add.text(this.game.world.centerX, 8, '', {
      font: '32px kenvector_future',
      fill: '#333',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'top',
    })
    this._title.anchor.set(0.5, 0)

    this._backBtn = new Button(this.game, 0, 0, 'buttonSmall', 'back', 14, this)
    this._backBtn.scale.set(0.6)
    this._backBtn.position.x = this._backBtn.width / 2
    this._backBtn.position.y = this._backBtn.height / 2
    this._backBtn.visible = false
    this._backBtn.onInputUp.add(() => this.game.state.start('MainMenu'))

    this.goldLabel = this.game.add.text(this.game.width - 8, 15, '0', {
      font: '18px kenvector_future_thin',
      fill: '#333',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    }, this)
    const goldIcon = this.game.add.sprite(this.game.width - 8, this.goldLabel.position.y + this.goldLabel.height * 0.5, 'sheet', 'coin', this)
    goldIcon.anchor.set(1, 0.5)
    goldIcon.scale.set(this.goldLabel.height / goldIcon.height * 0.8)

    this.rocketsLabel = this.game.add.text(this.game.width - 108, 15, '0', {
      font: '18px kenvector_future_thin',
      fill: '#333',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    }, this)
    const rocketsIcon = this.game.add.sprite(this.game.width - 130, this.rocketsLabel.position.y + this.rocketsLabel.height * 0.5, 'sheet', 'rocket', this)
    rocketsIcon.anchor.set(0.5)
    rocketsIcon.scale.set(this.rocketsLabel.height / rocketsIcon.height * 0.8)
  }

  update () {
    this.goldLabel.text = formatNumber(this.game.idle.idleEngine.inventory.gold, formatNumber.gold)
    this.goldLabel.position.x = this.game.width - this.goldLabel.width - 8 - 24 - 4
    this.rocketsLabel.text = this.game.idle.idleEngine.inventory.rocket.toString()
    this.rocketsLabel.position.x = this.game.width - this.rocketsLabel.width - 108 - 24 - 4
  }

  set title (title) {
    this._title.text = title
    this._background.visible = true
  }

  set backEnabled (enabled) {
    this._backBtn.visible = enabled
  }

}

module.exports = TopBar
