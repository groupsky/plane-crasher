/* global Phaser */
const moment = require('moment')
const Button = require('../ui/ButtonFont')
const Panel = require('../ui/Panel')

class IdleGains extends Panel {
  constructor (game, parent, x, y) {
    super(game, parent, x, y)

    this.background.scale.set(1.2)

    this.label = this.game.add.text(0, -50, 'While you were away for\n' +
      moment.duration(this.game.idle.idleEngine.time.idleElapsed).humanize() +
      ', \nyou gained ' +
      this.game.idle.idleEngine.idleGain.gold + ' coins',
      {
        font: '18px kenvector_future_thin',
        fill: '#000000',
        align: 'center',
        boundsAlignH: 'center',
        boundsAlignV: 'center'
      }, this)
    this.label.anchor.set(0.5)

    this.continueBtn = new Button(this.game, 0, 100, 'buttonLarge', 'Continue', 28, this)
    this.onContinue = this.continueBtn.onInputUp
  }
}

module.exports = IdleGains
