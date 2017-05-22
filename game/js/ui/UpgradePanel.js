/* global Phaser */
const Button = require('../ui/ButtonFont')

class UpgradePanel extends Phaser.Group {

  constructor (game, x, y, parent) {
    super(game, parent, 'upgradePanel')

    // this.background = this.create(0, 0, 'sheet', 'UIbg')
    // this.background.anchor.set(0.5)
    this.x = x
    this.y = y
    this.panelWidth = this.game.world.centerX - 27
    this.panelHeight = 120

	
    this.background = this.game.add.graphics(0,0, this)
    this.background.beginFill(0xFFFFFF)
    this.background.drawRect(0,0, this.panelWidth, this.panelHeight)
    this.background.endFill()
    this.background.alpha = 0.7
    this.add(this.background)

    this.buyBtn = new Button(this.game, 100, 35, 'buttonSmall', '', 32)
	  this.buyBtn.scale.set(0.7)
    this.add(this.buyBtn)
    this.buyBtn.position.x = this.panelWidth - 10 - this.buyBtn.width / 2
    this.buyBtn.position.y = this.buyBtn.height / 2 + 10

    this._title = this.game.add.text(50, 10, '', {
      font: '32px kenvector_future',
      fill: '#00FF00',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    })
    this.add(this._title)

    this._icon = this.game.add.image(10, 10, 'sheet', '', this)
  	this._icon.scale.set(0.3)
  	this.add(this._icon);

    this._description = this.game.add.text(10, 50, '', {
      font: '16px',
      fill: '#00FF00',
      align: 'left',
      boundsAlignH: 'center',
      boundsAlignV: 'center',
    })
    this.add(this._description)
    
  }

  set icon(frame) {
  	this._icon.frameName = frame
  }

  set description(description) {
    this._description.text = description
  }

  set price(price) {
    this.buyBtn.text = price
  }

  set title(title) {
  	this._title.text = title
  }

  set onClick(callback) {
    this.buyBtn.onInputUp.add(callback)
  }

}

module.exports = UpgradePanel
