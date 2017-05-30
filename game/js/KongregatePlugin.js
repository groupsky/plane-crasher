/* global Phaser, kongregateAPI, Kongregate */

function resolveApply (path, context, args) {
  const parts = path.split('.')
  const l = parts.length
  let method = context
  for (let i = 0; i < l; i++) {
    const part = parts[ i ]
    context = method
    method = context[ part ]
  }
  return method.apply(context, args)
}

class KongregatePlugin extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    this._pending = []
    this._kongregate = false
    kongregateAPI.loadAPI(() => {
      console.log('kongregate initialized')
      this._kongregate = kongregateAPI.getAPI()
      const l = this._pending.length
      for (let i = 0; i < l; i++) {
        const pending = this._pending[ i ]
        resolveApply(pending.action, this._kongregate, pending.args)
      }
      this._pending = false
    })
  }

  submitStat (name, value) {
    if (this._kongregate) {
      return this._kongregate.stats.submit(name, value)
    }
    this._pending.push({ action: 'stats.submit', args: [ name, value ] })
  }

  submitStats (stats) {
    for (let name in stats) {
      const val = stats[ name ]
      this.submitStat(name, val)
    }
  }
}

KongregatePlugin.configure = function () {
  return KongregatePlugin
}

if (process.env.NODE_ENV !== 'production') {
  Kongregate.Log.debugLevel = 5
}

module.exports = KongregatePlugin
