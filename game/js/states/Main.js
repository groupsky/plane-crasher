/* global Phaser */

const Ground = require('../actors/Ground')
const Plane = require('../actors/Plane')
const ObstacleGroup = require('../actors/ObstacleGroup')
const TopBar = require('../actors/TopBar')
const EndGame = require('../actors/EndGame')

class Main extends Phaser.State {
  preload () { }

  create () {
    this.oldFps = this.game.saveCpu.renderOnFPS
    this.game.saveCpu.renderOnFPS = 120

    this.score = {
      distance: 0,
      obstacles: 0,
      total: 0
    }
    this.stats = {
      distance: 0,
      time: 0,
      obstacles: 0,
      turbo: 0,
      turboTime: 0
    }
    this.coefs = {
      difficulty: 0,
      distance: this.game.idle.idleEngine.calcDistancePoints(),
      obstacleDistance: 500,
      speed: this.game.idle.idleEngine.calcSpeed(),
      obstacle: this.game.idle.idleEngine.calcObstaclePoints(),
      turboDuration: 1.5
    }
    this.lastObstacle = +Infinity
    this._speed = 0

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1200

    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.scale.setTo(this.world.height / 480)

    const topBar = new TopBar(this.game)

    this.obstacles = this.game.add.group()

    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.testForObstacleGenerator, this)

    // ground
    this.ground = new Ground(this.game, 0, this.world.height, this.world.width, this.world.height, 'groundDirt')
    this.add.existing(this.ground)

    // plane
    this.plane = new Plane(this.game, this.world.width * 2 / 7, this.world.height / 2, 'planeGreen')
    this.add.existing(this.plane)

    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
    this.actionKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.actionKey.onDown.addOnce(this.startGame, this)
    this.actionKey.onDown.add(this.plane.jump, this.plane)
    this.background.inputEnabled = true
    this.background.events.onInputDown.addOnce(this.startGame, this)
    this.background.events.onInputDown.add(() => this.plane.jump())

    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.ENTER ])
    this.action2Key = this.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    this.action2Key.onDown.add(this.turbo, this)
    this.turboBtn = this.game.add.button(10, this.world.height - 10, 'sheet', this.turbo, this, 'rocket', 'rocket', 'rocket', 'rocket')
    this.turboBtn.useHandCursor = true
    this.turboBtn.anchor.set(0, 1)
    this.turboBtn.scale.set(0.5)

    this.instructionGroup = this.add.group()
    this.instructionGroup.add(this.add.sprite(this.world.width / 2, 100, 'sheet', 'textGetReady'))
    this.instructionGroup.add(this.add.sprite(this.plane.x - this.plane.width * 1.5, this.plane.y, 'sheet', 'tapRight'))
    this.instructionGroup.add(this.add.sprite(this.plane.x + this.plane.width * 1.5, this.plane.y, 'sheet', 'tapLeft'))
    const tap = this.add.sprite(this.plane.x + this.plane.width, this.plane.y + this.plane.height * 2, 'sheet')
    this.instructionGroup.add(tap)
    this.instructionGroup.setAll('anchor.x', 0.5)
    this.instructionGroup.setAll('anchor.y', 0.5)
    tap.animations.add('default', [ 'tap', 'tapTick' ], 3, true)
    tap.animations.play('default')
    tap.anchor.set(1)

    this.scoreLabel = this.add.bitmapText(this.game.width * 0.5, 10, 'font', '0', 24)
    this.scoreLabel.anchor.set(0.5, 0)

    this.enterState('start')
    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  update () {
    if ([ 'start', 'end' ].includes(this.sceneState)) return

    this.game.physics.arcade.collide(this.plane, this.ground, this.deathHandler, null, this)
    this.obstacles.forEach(function (obstacle) {
      this.checkScore(obstacle)
      this.game.physics.arcade.collide(this.plane, obstacle, this.deathHandler, null, this)
    }, this)

    this.stats.time += this.game.time.physicsElapsed
    const distance = this.speed * this.game.time.physicsElapsed
    this.lastObstacle += distance
    this.stats.distance += distance
    this.score.distance = this.stats.distance * this.coefs.distance / this.world.width
    this.score.total = Math.floor(this.score.distance) + Math.floor(this.score.obstacles)

    this.scoreLabel.setText('' + this.score.total)

    if (this.sceneState === 'turbo') {
      this.stats.turboTime += this.game.time.physicsElapsed
      this.turboTimer -= this.game.time.physicsElapsed
      if (this.turboTimer <= 0) {
        this.enterState('play')
      }
    }
  }

  render () {
    // for (var i in this.obstacles.children) {
    // this.game.debug.body(this.obstacles.children[ i ].topObstacle)
    // }
  }

  get speed () { return this._speed }

  set speed (value) {
    value = value * this.coefs.speed
    if (this._speed === value) return
    this._speed = value
    this.background.autoScroll(-this._speed * 0.5, 0)
    this.ground.autoScroll(-this._speed, 0)
    this.obstacles.forEach((obstacle) => { obstacle.speed = -this._speed })
  }

  enterState (newState) {
    if (this.sceneState === newState) return
    const oldState = this.sceneState
    this.sceneState = newState

    switch (newState) {
      case 'start':
        this.speed = 200
        this.plane.body.allowGravity = false
        this.plane.alive = false
        break
      case 'play':
        this.plane.body.allowGravity = true
        this.plane.alive = true
        this.plane.playDefault()

        this.pipeGenerator.timer.start()
        this.speed = 200

        if (oldState === 'start') {
          this.instructionGroup.destroy()
        }
        break
      case 'turbo':
        if (oldState !== 'play') return
        this.stats.turbo++
        this.plane.playTurbo()
        this.speed = 1000

        this.turboTimer = this.coefs.turboDuration

        break
      case 'end':
        this.plane.body.allowGravity = false
        this.plane.alive = false

        this.plane.kill()
        this.obstacles.callAll('stop')
        this.background.stopScroll()
        this.ground.stopScroll()
        this.pipeGenerator.timer.stop()

        this.game.idle.idleEngine.addRecording(this.score.total, this.stats.time, this.stats.distance, this.stats.obstacles)
        this.game.idle.idleEngine.inventory.gold += this.score.total
        this.game.idle.save()

        this.endgame = new EndGame(this.game, null, this.world.centerX, this.world.centerY)
        this.endgame.show(this.score, this.stats, this.coefs)
        this.game.add.existing(this.endgame)
        break
    }
  }

  testForObstacleGenerator () {
    if (this.lastObstacle < this.coefs.obstacleDistance) return
    this.lastObstacle = 0
    this.generateObstacles()
    const dist = (450 * this.stats.obstacles + 5) / (this.stats.obstacles + 5)
    this.coefs.obstacleDistance = this.game.rnd.integerInRange(500 - dist, 500 + dist * 0.5)
  }

  generateObstacles () {
    if (this.sceneState === 'start') return

    let obstacleGroup = this.obstacles.getFirstExists(false)
    if (!obstacleGroup) {
      obstacleGroup = new ObstacleGroup(this.game, this.obstacles, 'rock')
    }
    obstacleGroup.reset(this.game.width, 0, this.coefs.difficulty++, -this._speed)
  }

  deathHandler (plane, enemy) {
    this.enterState('end')
  }

  shutdown () {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
    this.game.input.keyboard.removeKey(Phaser.Keyboard.ENTER)
    this.plane.destroy()
    this.obstacles.destroy()
    this.endgame.destroy()

    this.game.saveCpu.renderOnFPS = this.oldFps
  }

  startGame () {
    this.enterState('play')
  }

  turbo () {
    if (this.sceneState !== 'play') return
    if (this.game.idle.idleEngine.inventory.rocket <= 0) return

    this.game.idle.idleEngine.inventory.rocket--
    this.enterState('turbo')
  }

  checkScore (obstacle) {
    if (!obstacle.exists) return
    if (obstacle.hasScored) return
    if (obstacle.topObstacle.world.x > this.plane.world.x) return
    obstacle.hasScored = true
    this.stats.obstacles++
    this.score.obstacles += 1 + obstacle.difficulty * this.coefs.obstacle
  }
}

module.exports = Main
