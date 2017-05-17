/* global Phaser */

class TopBar extends Phaser.Group {

  constructor (game, parent) {
    super(game, parent)

    this.goldLabel = this.game.add.text(this.game.width - 8, 8, '0', {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    }, this)
    const goldIcon = this.game.add.sprite(this.game.width - 8, this.goldLabel.position.y + this.goldLabel.height * 0.5, 'sheet', 'coin', this)
    goldIcon.anchor.set(1, 0.5)
    goldIcon.scale.set(this.goldLabel.height / goldIcon.height*0.8)

    this.rocketsLabel = this.game.add.text(this.game.width - 108, 8, '0', {
      font: '24px kenvector_future_thin',
      fill: '#ffffff',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    }, this)
    const rocketsIcon = this.game.add.sprite(this.game.width - 130, this.rocketsLabel.position.y + this.rocketsLabel.height * 0.5, 'sheet', 'rocket', this)
    rocketsIcon.anchor.set(0.5)
    rocketsIcon.scale.set(this.rocketsLabel.height / rocketsIcon.height * 0.8)
  }

  update () {
    this.goldLabel.text = this.game.idle.idleEngine.inventory.gold.toString()
    this.goldLabel.position.x = this.game.width - this.goldLabel.width - 8 - 24 - 4
    this.rocketsLabel.text = this.game.idle.idleEngine.inventory.rocket.toString()
    this.rocketsLabel.position.x = this.game.width - this.rocketsLabel.width - 108 - 24 - 4
  }

}

module.exports = TopBar
