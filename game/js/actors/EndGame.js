/* global Phaser */

const Button = require('../ui/Button')

class EndGame extends Phaser.Group {
  constructor (game, parent, x, y) {
    super(game, parent)

    this.x = x
    this.y = y

    const background = this.create(0, 0, 'sheet', 'UIbg.png')
    background.anchor.set(0.5)
    background.scale.set(1.5)

    const gameover = this.create(0, -200, 'sheet', 'textGameOver.png')
    gameover.anchor.set(0.5)

    const timeText = this.createLbl(-100, -160, 'Time:')
    this.timeLabel = this.createDLbl(100, -160)

    const obstaclesNoText = this.createLbl(-100, -120, '# Obst:')
    this.obstaclesNoLabel = this.createDLbl(100, -120)

    const obstaclesText = this.createLbl(-100, -60, 'Obst:')
    this.obstaclesLabel = this.createDLbl(100, -60)

    const distanceText = this.createLbl(-100, -20, 'Dist:')
    this.distanceLabel = this.createDLbl(100, -20)

    // const timeText = this.createLbl(-100, -10, 'Time:')
    // this.timeLabel = this.createDLbl(100, -10)

    const scoreText = this.createLbl(-100, 20, 'Score:', 24)
    this.scoreLabel = this.createDLbl(100, 20, 24)

    const retryBtn = new Button(this.game, -100, 125, 'buttonSmall.png', 'retry', 24)
    this.add(retryBtn)
    retryBtn.onInputUp.add(() => this.game.state.start('Main'))

    const menuBtn = new Button(this.game, 100, 125, 'buttonSmall.png', 'menu', 24)
    this.add(menuBtn)
    menuBtn.onInputUp.add(() => this.game.state.start('MainMenu'))
  }

  createLbl (x, y, text, size) {
    const label = this.game.add.text(x, y, text || '', {
      font: (size || 18) + 'px kenvector_future',
      fill: '#000000',
      align: 'left',
      boundsAlignH: 'left',
      boundsAlignV: 'top',
    }, this)
    this.add(label)
    return label
  }

  createDLbl (x, y, size) {
    const label = this.game.add.bitmapText(x, y, 'font', '0', size || 18, this)
    label.align = 'right'
    label.anchor.set(1, 0)
    return label
  }

  show (score, time, distance, obstacles) {
    const numbers = {
      time: 0,
      obstacleCount: 0,
      obstacles: 0,
      distance: 0,
      score: 0,
    }
    const scoreTween = this.game.add.tween(numbers).to({
      time: time,
      obstacleCount: obstacles,
      obstacles: Math.round(score - Math.round(distance * this.game.idle.idleEngine.calcDistancePoints() / this.game.width)),
      distance: Math.round(distance * this.game.idle.idleEngine.calcDistancePoints() / this.game.width),
      score: score,
    }, 500)

    scoreTween.onUpdateCallback(() => {
      this.timeLabel.text = '' + Math.round(numbers.time)
      this.obstaclesNoLabel.text = '' + Math.round(numbers.obstacleCount)
      this.obstaclesLabel.text = '' + Math.round(numbers.obstacles)
      this.distanceLabel.text = '' + Math.round(numbers.distance)
      this.scoreLabel.text = '' + Math.round(numbers.score)
    })

    scoreTween.start()
  }
}

module.exports = EndGame
