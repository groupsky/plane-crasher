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
    this.panelWidth = this.game.world.centerX - 27
    this.panelHeight = 120

    this.background = this.game.add.image(0, 0, 'sheet', 'UIbg', this)
    this.background.width = this.panelWidth
    this.background.height = this.panelHeight

    this.buyBtn = new Button(this.game, 100, 35, '', styles.btnUpgrade, this)
    this.buyBtn.scale.set(0.8)
    this.buyBtn.position.x = this.panelWidth - 10 - this.buyBtn.width / 2
    this.buyBtn.position.y = this.buyBtn.height / 2 + 10

    this._title = new Label(this.game, 10, 10, '', styles.upgradeTitle, this)
    this._description = new Label(this.game, 10, 45, '', styles.upgradeDesc, this)
  }

  set icon (frame) {
    // this._icon.frameName = frame
  }

  set description (description) {
    this._description.text = description
  }

  set price (price) {
    this.buyBtn.text = formatNumber(price, formatNumber.gold)
  }

  set title (title) {
    this._title.text = title
  }

  set onClick (callback) {
    this.buyBtn.onInputUp.add(callback)
  }

}

module.exports = UpgradePanel
