/* global Phaser */
const Button = require('./Button')
const formatNumber = require('../utils').formatNumber
const Label = require('./Label')
const styles = require('./styles')

class UpgradePanel extends Phaser.Group {
  constructor (game, x, y, parent) {
    super(game, parent, 'upgradePanel')

    this.x = x
    this.y = y
    this.panelWidth = this.game.world.centerX - 24
    this.panelHeight = 120

    this.background = this.game.add.image(0, 0, 'sheet', 'UIbg', this)
    this.background.width = this.panelWidth
    this.background.height = this.panelHeight

    this.buyBtn = new Button(this.game, this.panelWidth - 8, this.panelHeight - 8, '-', styles.btnLarge, this)
    this.buyBtn.x -= this.buyBtn.width * 0.5
    this.buyBtn.y -= this.buyBtn.height * 0.5

    this._price = 0
    this._title = new Label(this.game, 8, 8, '', styles.upgradeTitle, this)
    this._description = new Label(this.game, 8, 36, '', styles.upgradeDesc, this)
    this._level = new Label(this.game, this.panelWidth - 8, 8, '', styles.level, this)
    this._level.anchor.set(1, 0)
  }

  set icon (frame) {
    // this._icon.frameName = frame
  }

  set description (description) {
    this._description.text = description
  }

  get price () { return this._price }

  set price (price) {
    this._price = price
    this.buyBtn.text = formatNumber(price, formatNumber.gold)
  }

  set title (title) {
    this._title.text = title
  }

  set onClick (callback) {
    this.buyBtn.onInputUp.add(callback)
  }

  set level (value) {
    this._level.text = value
  }

  update () {
    this.buyBtn.disabled = this.game.idle.idleEngine.inventory.gold < this.price
  }

}

module.exports = UpgradePanel
