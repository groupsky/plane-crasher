const Manager = require('./Manager')
const Bot = require('./Bot')
const Recording = require('./Recording')
const clone = require('../utils').clone
const moment = require('moment')
const subtract = require('../utils').subtract

class Idle {
  constructor () {
    this.bots = new Manager(this, null, Bot)
    this.defs = {
      bot: {
        label: 'AutoBot',
        price: 100,
        factor: 10,
      },
      rocket: {
        label: 'Rocket',
        price: 50,
        factor: 1.03,
      },
      distancePoints: {
        label: 'Distance',
        price: 10,
        factor: 1.5,
        val: 0.2,
      },
      obstaclePoints: {
        label: 'Obstacle',
        price: 25,
        factor: 1.78,
        val: 0.05,
      },
      jumpPrecision: {
        label: 'Jump',
        price: 100,
        factor: 2,
        val: 50,
      },
      speed: {
        label: 'Speed',
        price: 250,
        factor: 1.65,
        val: 0.1,
      },
    }
    this.recordings = new Manager(this, null, Recording)
    this.inventory = {
      gold: 0,
      rocket: 0,
      distancePoints: 0,
      obstaclePoints: 0,
      jumpPrecision: 0,
      speed: 0,
    }
    this.idleGain = false
    this.recordIdleGain = false
    this.stats = {
      bought: {
        rocket: 0,
      },
      best: {
        score: 0,
        time: 0,
      },
    }
    this.time = {
      lastUpdate: 0,
      realElapsed: 0,
      idleElapsed: 0,
    }
  }

  init (state) {
    this.bots.init(state.bots)
    this.recordings.init(state.recordings)
    this.inventory = clone(state.inventory)
    this.stats = clone(state.stats)
    this.time = clone(state.time)

    console.log('idle time', moment.duration(new Date().getTime() - this.time.lastUpdate).humanize())
    this.recordIdleGain = true
  }

  save () {
    return {
      bots: this.bots.save(),
      recordings: this.recordings.save(),
      inventory: clone(this.inventory),
      stats: clone(this.stats),
      time: clone(this.time),
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

    if (this.recordIdleGain) {
      this.recordIdleGain = false
      this.time.idleElapsed = this.time.realElapsed
      const old = clone(this.inventory)
      this.bots.update()
      this.idleGain = subtract(this.inventory, old)
      console.log('idle gains', this.idleGain)
    }
  }

  addRecording (score, time, distance, obstacles) {
    if (this.stats.best.score < score) {
      this.stats.best.score = score
      this.stats.best.time = time
    }
    this.recordings.removeAll()
    this.recordings.add(Recording, {score: score, time: time, distance: distance, obstacles: obstacles})
  }

  static calcCost (def, have, want) {
    if (!def.factor || def.factor <= 1) return def.price * want
    return def.price * Math.pow(def.factor, have) * (Math.pow(def.factor, want) - 1) / (def.factor - 1)
  }

  botCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.bot, this.bots.items.length, count))
  }

  buyBot (count) {
    const cost = this.botCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.bots.add(Bot, { profit: this.stats.best.score, interval: this.stats.best.time * 10000 })
  }

  rocketCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.rocket, this.stats.bought.rocket, count))
  }

  buyRocket (count) {
    const cost = this.rocketCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.rocket += count
    this.stats.bought.rocket += count
  }

  distancePointsCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.distancePoints, this.inventory.distancePoints, count))
  }

  buyDistancePoints (count) {
    const cost = this.distancePointsCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.distancePoints += count
  }

  calcDistancePoints () {
    return this.defs.distancePoints.val * this.inventory.distancePoints
  }

  obstaclePointsCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.obstaclePoints, this.inventory.obstaclePoints, count))
  }

  buyObstaclePoints (count) {
    const cost = this.obstaclePointsCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.obstaclePoints += count
  }

  calcObstaclePoints () {
    return this.defs.obstaclePoints.val * this.inventory.obstaclePoints
  }

  jumpPrecisionCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.jumpPrecision, this.inventory.jumpPrecision, count))
  }

  buyJumpPrecision (count) {
    const cost = this.jumpPrecisionCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.jumpPrecision += count
  }

  calcJumpPrecision () {
    return (this.inventory.jumpPrecision + this.defs.jumpPrecision.val) / (2 * this.inventory.jumpPrecision + this.defs.jumpPrecision.val)
  }

  speedCost (count) {
    return Math.ceil(Idle.calcCost(this.defs.speed, this.inventory.speed, count))
  }

  buySpeed (count) {
    const cost = this.speedCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.speed += count
  }

  calcSpeed () {
    return 1 + this.inventory.speed * this.defs.speed.val
  }
}

module.exports = Idle
