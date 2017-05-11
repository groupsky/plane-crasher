/* global Phaser */

const Idle = require('./idle')

class IdlePlugin extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    this.idleEngine = new Idle()
  }

  update () {
    this.idleEngine.update()
  }

  destroy () {
    this.idleEngine.destroy()
    this.idleEngine = null
  }
}

IdlePlugin.configure = function () {
  return IdlePlugin
}

module.exports = IdlePlugin
