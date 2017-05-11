const Manager = require('./Manager')
const Bot = require('./Bot')
const Recording = require('./Recording')

class Idle {
  constructor () {
    this.bots = new Manager(this)
    this.defs = {
      bot: {
        label: 'AutoBot',
        price: 100,
        factor: 10,
      },
      rocket: {
        label: 'Rocket',
        price: 50,
      },
    }
    this.recordings = new Manager(this)
    this.inventory = {
      gold: 100,
      rocket: 1,
    }
    this.time = {
      lastUpdate: 0,
      realElapsed: 0,
    }
  }

  update () {
    const now = new Date().getTime()
    if (this.time.lastUpdate === 0 || this.time.lastUpdate >= now) {
      this.time.lastUpdate = now
      this.time.realElapsed = 0
      return
    }

    this.time.realElapsed = now - this.time.lastUpdate
    this.time.lastUpdate = now

    this.bots.update()
  }

  addRecording (score, time, distance, obstacles) {
    this.recordings.removeAll()
    this.recordings.add(Recording, score, time, distance, obstacles)
  }

  static calcCost (def, have, want) {
    if (!def.factor || def.factor <= 1) return def.price * want
    return def.price * Math.pow(def.factor, have) * (Math.pow(def.factor, want) - 1) / (def.factor - 1)
  }

  botCost (count) {
    return Idle.calcCost(this.defs.bot, this.bots.items.length, count)
  }

  buyBot (count) {
    const cost = Idle.calcCost(this.defs.bot, this.bots.items.length, count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    const recording = this.recordings.items[ 0 ]
    this.bots.add(Bot, recording.score, recording.time)
  }
  
  rocketCost (count) {
    return Idle.calcCost(this.defs.rocket, this.inventory.rocket, count)
  }

  buyRocket (count) {
    const cost = Idle.calcCost(this.defs.rocket, this.inventory.rocket, count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.rocket += count
  }
}

module.exports = Idle
