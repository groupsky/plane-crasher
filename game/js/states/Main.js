/* global Phaser */

const Ground = require('../actors/Ground')
const Plane = require('../actors/Plane')
const ObstacleGroup = require('../actors/ObstacleGroup')
const TopBar = require('../actors/TopBar')
const EndGame = require('../actors/EndGame')

class Main extends Phaser.State {
  preload () { }

  create () {
    if (this.game.saveCpu) {
      this.oldFps = this.game.saveCpu.renderOnFPS
      this.game.saveCpu.renderOnFPS = 120
    }

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
      turboTime: 0,
      jumps: 0,
    }
    this.coefs = {
      difficulty: 1,
      distance: this.game.idle.idleEngine.calcDistancePoints(),
      obstacleDistance: 500,
      speed: this.game.idle.idleEngine.calcSpeed(),
      obstacle: this.game.idle.idleEngine.calcObstaclePoints(),
      turboDuration: 0.125
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
    this.actionKey.onDown.add(this.jump, this)
    this.background.inputEnabled = true
    this.background.events.onInputDown.addOnce(this.startGame, this)
    this.background.events.onInputDown.add(this.jump, this)

    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.ENTER ])
    this.action2Key = this.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    this.action2Key.onDown.add(this.turbo, this)
    this.turboBtn = this.game.add.button(10, this.world.height - 10, 'sheet', this.turbo, this, 'buttonSmall', 'buttonSmall', 'buttonSmall', 'buttonSmall')
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
    // this.scoreLabel = this.add.text(this.game.width * 0.5, 10, '0', {
    //   font: '24px kenvector_future_thin',
    //   fill: '#ffffff',
    //   align: 'center',
    //   boundsAlignH: 'center',
    //   boundsAlignV: 'top',
    // })
    this.scoreLabel.anchor.set(0.5, 0)

    for (let i = 0; i < 10; i++) {
      new ObstacleGroup(this.game, this.obstacles, 'rock').exists = false
    }

    this.enterState('start')
    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  update () {
    if ([ 'start', 'end' ].indexOf(this.sceneState) !== -1) return

    this.game.physics.arcade.collide(this.plane, this.ground, this.deathHandler, null, this)
    for (let i = this.obstacles.children.length; i--;) {
      this.checkScore(this.obstacles.children[ i ])
      this.game.physics.arcade.collide(this.plane, this.obstacles.children[ i ], this.deathHandler, null, this)
    }

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
    //   this.game.debug.body(this.obstacles.children[ i ].topObstacle)
    //   break
    // }
    // this.game.debug.body(this.plane)
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

        this.game.idle.idleEngine.recordPlay(this.score, this.stats, this.coefs)
        this.game.idle.save()

        // this.game.state.start('MainMenu')
        // return

        this.endgame = new EndGame(this.game, null, this.world.centerX, this.world.centerY)
        this.endgame.show(this.score, this.stats, this.coefs)
        this.game.add.existing(this.endgame)
        break
    }
  }

  testForObstacleGenerator () {
    if ([ 'start', 'end' ].indexOf(this.sceneState) !== -1) return
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
    if (this.endgame)    this.endgame.destroy()

    if (this.game.saveCpu) {
      this.game.saveCpu.renderOnFPS = this.oldFps
    }
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
  
  jump () {
    if ([ 'start', 'end' ].indexOf(this.sceneState) !== -1) return
    
    this.stats.jumps++
    this.plane.jump()
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
