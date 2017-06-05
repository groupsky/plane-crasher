/* global Phaser */
const moment = require('moment')
const Button = require('../ui/ButtonFont')
const Panel = require('../ui/Panel')
const Label = require('../ui/Label')
const formatNumber = require('../utils').formatNumber
const styles = require('../ui/styles')

class IdleGains extends Panel {
  constructor (game, parent, x, y) {
    super(game, parent, x, y)

    this.background.scale.set(1.2)

    const text = 'While you were away for\n' +
      moment.duration(this.game.idle.idleEngine.time.idleElapsed).humanize() +
      ', \nyou gained ' +
      formatNumber(this.game.idle.idleEngine.idleGain.gold, formatNumber.gold)

    this.label = new Label(this.game, 0, -50, text, styles.idleGainLabel, this)
    this.label.anchor.set(0.5)

    this.continueBtn = new Button(this.game, 0, 100, 'buttonLarge', 'Continue', 28, this)
    this.onContinue = this.continueBtn.onInputUp
  }
}

module.exports = IdleGains
