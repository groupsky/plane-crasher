/* global Phaser */

const Ground = require('../actors/Ground')
const Plane = require('../actors/Plane')
const ObstacleGroup = require('../actors/ObstacleGroup')
const EndGame = require('../ui/EndGame')

class Main extends Phaser.State {
  preload () { }

  create () {
    this.difficulty = 0
    this.score = 0
    this.gameover = false

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1200

    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background.png')
    this.background.scale.setTo(this.world.height / 480)
    this.background.autoScroll(-100, 0)

    this.obstacles = this.game.add.group()

    // ground
    this.ground = new Ground(this.game, 0, this.world.height, this.world.width, this.world.height, 'groundDirt.png')
    this.add.existing(this.ground)

    // plane
    this.plane = new Plane(this.game, this.world.width * 2 / 7, this.world.height / 2, 'planeGreen')
    this.add.existing(this.plane)

    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
    this.actionKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.actionKey.onDown.addOnce(this.startGame, this)
    this.input.onDown.addOnce(this.startGame, this)
    this.actionKey.onDown.add(this.plane.jump, this.plane)
    this.input.onDown.add(this.plane.jump, this.plane)

    this.instructionGroup = this.add.group()
    this.instructionGroup.add(this.add.sprite(this.world.width / 2, 100, 'sheet', 'textGetReady.png'))
    this.instructionGroup.add(this.add.sprite(this.plane.x - this.plane.width * 1.5, this.plane.y, 'sheet', 'tapRight.png'))
    this.instructionGroup.add(this.add.sprite(this.plane.x + this.plane.width * 1.5, this.plane.y, 'sheet', 'tapLeft.png'))
    const tap = this.add.sprite(this.plane.x + this.plane.width, this.plane.y + this.plane.height * 2, 'sheet')
    this.instructionGroup.add(tap)
    this.instructionGroup.setAll('anchor.x', 0.5)
    this.instructionGroup.setAll('anchor.y', 0.5)
    tap.animations.add('default', [ 'tap.png', 'tapTick.png' ], 3, true)
    tap.animations.play('default')
    tap.anchor.set(1)

    this.scoreLabel = this.add.bitmapText(this.game.width / 2, 10, 'font', this.score.toString(), 24)
    this.scoreLabel.anchor.set(0.5, 0)
  }

  update () {
    this.game.physics.arcade.collide(this.plane, this.ground, this.deathHandler, null, this)

    if (!this.gameover) {
      this.obstacles.forEach(function (obstacle) {
        this.checkScore(obstacle)
        this.game.physics.arcade.collide(this.plane, obstacle, this.deathHandler, null, this)
      }, this)
      // if (this.plane.world.y < 0) this.deathHandler()
    }
  }

  render () {
    // this.game.debug.body(this.plane)
    // this.game.debug.body(this.ground)
    // this.game.debug.body(this.obstacles.getAt(0).topObstacle)
    // this.game.debug.text(`Diff: ${this.difficulty}`, 0, 20)
    // this.game.debug.text(`Score: ${this.score}`, 0, 40)
  }

  generateObstacles () {
    const obstacleGroup = this.obstacles.getFirstExists(false) || new ObstacleGroup(this.game, this.obstacles, 'rock')
    obstacleGroup.reset(this.game.width, 0, this.difficulty++)

    // this.game.add.existing(obstacleGroup)
  }

  deathHandler (plane, enemy) {
    if (this.gameover) return
    this.gameover = true
    this.plane.kill()
    this.obstacles.callAll('stop')
    this.obstacleGenerator.timer.stop()
    this.background.stopScroll()
    this.ground.stopScroll()

    window.localStorage.setItem('score', this.score)
    window.localStorage.setItem('best', Math.max(this.score, window.localStorage.getItem('best') || 0))

    // this.endgame = new EndGame(this.game)
    // this.endgame.score = this.score
    // this.add.existing(this.endgame)
    // this.endgame.onRetry.add(() => {
    //   this.game.state.start('Main')
    // })

    this.game.state.start('MainMenu')
  }

  shutdown () {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
    this.plane.destroy()
    this.obstacles.destroy()
  }

  startGame () {
    if (this.plane.alive || this.gameover) return

    this.plane.body.allowGravity = true
    this.plane.alive = true

    this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2.25, this.generateObstacles, this)
    this.obstacleGenerator.timer.start()
    this.generateObstacles()

    this.instructionGroup.destroy()
  }

  checkScore (obstacle) {
    if (!obstacle.exists) return
    if (obstacle.hasScored) return
    if (obstacle.topObstacle.world.x > this.plane.world.x) return
    obstacle.hasScored = true
    this.score++
    this.scoreLabel.setText(this.score.toString())
  }
}

module.exports = Main
