const Manager = require('./Manager')
const Bot = require('./Bot')
const Recording = require('./Recording')

class Idle {
  constructor () {
    this.bots = new Manager(this)
    this.defs = {
      bot: {
        label: 'AutoBot',
        price: 10000,
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
        val: 1,
      },
      obstaclePoints: {
        label: 'Obstacle',
        price: 25,
        factor: 1.34,
        val: 1,
      },
    }
    this.recordings = new Manager(this)
    this.inventory = {
      gold: 0,
      rocket: 0,
      distancePoints: 0,
      obstaclePoints: 0,
    }
    this.stats = {
      bought: {
        rocket: 0,
      }
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
    return Math.ceil(Idle.calcCost(this.defs.bot, this.bots.items.length, count))
  }

  buyBot (count) {
    const cost = this.botCost(count)
    if (this.inventory.gold < cost) return false
    this.inventory.gold -= cost
    const recording = this.recordings.items[ 0 ]
    this.bots.add(Bot, recording.score, recording.time)
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
}

module.exports = Idle
