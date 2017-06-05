/* global Phaser */

const Label = require('../ui/Label')
const formatNumber = require('../utils').formatNumber
const Button = require('../ui/Button')
const styles = require('../ui/styles')

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

    this._title = new Label(this.game, this.game.world.centerX, this._height * 0.5+5, '', styles.titleStyle)
    this._title.anchor.set(0.5, 0.5)

    this._backBtn = new Button(this.game, 0, 0, 'B', styles.btnSmall, this)
    this._backBtn.position.x = this._backBtn.width / 2
    this._backBtn.position.y = this._backBtn.height / 2
    this._backBtn.visible = false
    this._backBtn.onInputUp.add(this.goBack, this)
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.B ])
    this.backKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B)
    this.backKey.onDown.add(this.goBack, this)

    this.goldLabel = new Label(this.game, this.game.width - 8, 15, '0', styles.topBarLabel, this)
    this.goldLabel.anchor.set(1, 0)
    this.goldIcon = this.game.add.sprite(this.game.width - 8, this.goldLabel.position.y + this.goldLabel.height * 0.5, 'sheet', 'coin', this)
    this.goldIcon.anchor.set(1, 0.5)
    this.goldIcon.scale.set(this.goldLabel.height / this.goldIcon.height)

    this.rocketsLabel = new Label(this.game, this.game.width - 108, 15, '0', styles.topBarLabel, this)
    this.rocketsLabel.anchor.set(1, 0)
    this.rocketsIcon = this.game.add.sprite(this.game.width - 130, this.rocketsLabel.position.y + this.rocketsLabel.height * 0.5, 'sheet', 'rocket', this)
    this.rocketsIcon.anchor.set(0.5)
    this.rocketsIcon.scale.set(this.rocketsLabel.height / this.rocketsIcon.height)
  }

  goBack () {
    this.game.state.start('MainMenu')
  }

  update () {
    this.goldLabel.text = formatNumber(this.game.idle.idleEngine.inventory.gold)
    this.goldLabel.position.x = this.goldIcon.x - this.goldIcon.width - 4
    this.rocketsLabel.text = this.game.idle.idleEngine.inventory.rocket.toString()
    this.rocketsLabel.position.x = this.rocketsIcon.x - this.rocketsIcon.width - 4
  }

  shutdown () {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.B)
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
