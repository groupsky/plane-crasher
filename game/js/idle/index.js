const Manager = require('./Manager')
const Bot = require('./Bot')
const clone = require('../utils').clone
const subtract = require('../utils').subtract
const merge = require('lodash/merge')

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
    this.inventory = {
      gold: 0,
      rocket: 0,
      distancePoints: 0,
      obstaclePoints: 0,
      jumpPrecision: 0,
      speed: 0,
    }
    this.stats = {
      bought: {
        bot: 0,
        rocket: 0,
        distancePoints: 0,
        obstaclePoints: 0,
        jumpPrecision: 0,
        speed: 0,
      },
      best: {
        score: 0,
        time: 0,
        distance: 0,
        obstacles: 0,
      },
      last: {
        scores: {
          distance: 0,
          obstacles: 0,
          total: 0,
        },
        stats: {
          distance: 0,
          time: 0,
          obstacles: 0,
          turbo: 0,
          turboTime: 0,
          jumps: 0
        }
      },
      totals: {
        plays: 0,
        gold: {
          earned: 0,
          bots: 0,
        },
        scores: {
          distance: 0,
          obstacles: 0,
          total: 0,
        },
        stats: {
          distance: 0,
          time: 0,
          obstacles: 0,
          turbo: 0,
          turboTime: 0,
          jumps: 0
        }
      }
    }
    this.time = {
      lastUpdate: 0,
      realElapsed: 0,
      idleElapsed: 0,
    }
    this.idleGain = false
    this.recordIdleGain = false
  }

  init (state) {
    this.bots.init(state.bots)
    this.inventory = merge(this.inventory, state.inventory)
    this.stats = merge(this.stats, state.stats)
    this.time = merge(this.time, state.time)

    this.recordIdleGain = true
  }

  save () {
    return {
      bots: this.bots.save(),
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

    let old
    if (this.recordIdleGain) {
      this.recordIdleGain = false
      this.time.idleElapsed = this.time.realElapsed
      old = clone(this.inventory)
    }

    // the actual update logic
    this.bots.update()

    // finalize offline gain calc
    if (this.recordIdleGain) {
      this.idleGain = subtract(this.inventory, old)
    }
  }

  recordPlay (scores, stats, coefs) {
    this.inventory.gold += scores.total
    this.stats.totals.gold.earned += scores.total

    this.stats.last = {
      scores: scores,
      stats: stats
    }

    this.stats.totals.plays++
    this.stats.totals.scores.distance += scores.distance
    this.stats.totals.scores.obstacles += scores.obstacles
    this.stats.totals.scores.total += scores.total
    this.stats.totals.stats.distance += stats.distance
    this.stats.totals.stats.obstacles += stats.obstacles
    this.stats.totals.stats.time += stats.time
    this.stats.totals.stats.turbo += stats.turbo
    this.stats.totals.stats.turboTime += stats.turboTime
    this.stats.totals.stats.jumps += stats.jumps

    if (this.stats.best.score < scores.total) {
      this.stats.best.score = scores.total
      this.stats.best.time = stats.time
    }
    if (this.stats.best.distance < stats.distance) this.stats.best.distance = stats.distance
    if (this.stats.best.obstacles < stats.obstacles) this.stats.best.obstacles = stats.obstacles
  }

  static calcCost (def, have, want) {
    if (!def.factor || def.factor <= 1) return def.price * want
    return def.price * Math.pow(def.factor, have) * (Math.pow(def.factor, want) - 1) / (def.factor - 1)
  }

  botLevel () {
    return this.bots.items.length
  }

  botCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.bot, this.botLevel(), count))
  }

  initBot (bot) {
    bot.init({ profit: this.stats.best.score, interval: this.stats.best.time * 10000 })
  }

  buyBot (count) {
    if (count === undefined) count = 1
    const cost = this.botCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    const bot = this.bots.add(Bot)
    this.initBot(bot)
    return bot
  }

  upBot (bot) {
    const cost = -this.botCost(-1)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.initBot(bot)
  }

  rocketCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.rocket, this.stats.bought.rocket, count))
  }

  buyRocket (count) {
    if (count === undefined) count = 1
    const cost = this.rocketCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.rocket += count
    this.stats.bought.rocket += count
  }

  distancePointsLevel () {
    return this.inventory.distancePoints
  }

  distancePointsCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.distancePoints, this.distancePointsLevel(), count))
  }

  buyDistancePoints (count) {
    if (count === undefined) count = 1
    const cost = this.distancePointsCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.distancePoints += count
  }

  calcDistancePoints () {
    return this.defs.distancePoints.val * this.inventory.distancePoints
  }

  obstaclePointsLevel () {
    return this.inventory.obstaclePoints
  }

  obstaclePointsCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.obstaclePoints, this.obstaclePointsLevel(), count))
  }

  buyObstaclePoints (count) {
    if (count === undefined) count = 1
    const cost = this.obstaclePointsCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.obstaclePoints += count
  }

  calcObstaclePoints () {
    return this.defs.obstaclePoints.val * this.inventory.obstaclePoints
  }

  jumpPrecisionLevel () {
    return this.inventory.jumpPrecision
  }

  jumpPrecisionCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.jumpPrecision, this.jumpPrecisionLevel(), count))
  }

  buyJumpPrecision (count) {
    if (count === undefined) count = 1
    const cost = this.jumpPrecisionCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    this.inventory.jumpPrecision += count
  }

  calcJumpPrecision () {
    return (this.inventory.jumpPrecision + this.defs.jumpPrecision.val) / (2 * this.inventory.jumpPrecision + this.defs.jumpPrecision.val)
  }

  speedLevel () {
    return this.inventory.speed
  }

  speedCost (count) {
    if (count === undefined) count = 1
    return Math.ceil(Idle.calcCost(this.defs.speed, this.speedLevel(), count))
  }

  buySpeed (count) {
    if (count === undefined) count = 1
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
