/* global Phaser */

const debounce = require('lodash/debounce')
const LZstring = require('lz-string')
const pkg = require('../../package.json')
const semver = require('semver')
const Idle = require('./idle')

class IdlePlugin extends Phaser.Plugin {
  constructor (game, parent, key) {
    super(game, parent)

    this.idleEngine = new Idle()

    this.savekey = 'save'
    this.save = debounce(() => this.saveNow(), 250)
  }

  init (key) {
    if (key !== undefined) this.savekey = key

    const saveState = window.localStorage[ this.savekey ]
    if (saveState) {
      try {
        this.restoreSave(saveState)
      } catch (e) {
        console.error('unable to restore save', e)
      }
    } else {
      console.log('no state')
    }
    this._lastSave = new Date().getTime()

    window.onbeforeunload = this.saveNow.bind(this)
  }

  restoreSave (saveState) {
    saveState = LZstring.decompressFromBase64(saveState)
    saveState = JSON.parse(saveState)
    if (!saveState) {
      console.warn('empty save state')
      return
    }
    if (!saveState.version) {
      console.warn('no version in save')
      return
    }

    var saveVersion = semver(saveState.version)
    var gameVersion = semver(pkg.version)

    // major change - no migration
    if (saveVersion.major !== gameVersion.major) {
      console.warn('Save game from previous version, cannot be used!')
      return
    }
    // if we couldn't migrate to same minor - trash it
    // if (saveVersion.minor !== gameVersion.minor) {
    //   console.warn('Save game cannot be used!')
    //   return
    // }

    this.idleEngine.init(saveState.gameState)
  }

  saveNow () {
    var saveState = LZstring.compressToBase64(JSON.stringify({
      version: pkg.version,
      gameState: this.idleEngine.save()
    }))
    window.localStorage[ this.savekey ] = saveState
    if (process.env.NODE_ENV !== 'production') {
      console.log('saved', saveState.length)
    }
    this._lastSave = new Date().getTime()
  }

  update () {
    this.idleEngine.update()

    if (new Date().getTime() - this._lastSave > 60000) {
      this.saveNow()
    }
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
