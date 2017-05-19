/* global Phaser */

const Button = require('../ui/Button')

class EndGame extends Phaser.Group {
  constructor (game, parent, x, y) {
    super(game, parent)

    this.x = x
    this.y = y

    const background = this.create(0, 0, 'sheet', 'UIbg')
    background.anchor.set(0.5)
    background.scale.set(1.25, 1.15)

    const gameover = this.create(0, -160, 'sheet', 'textGameOver')
    gameover.anchor.set(0.5)

    const timeText = this.createLbl(-100, -120, 'Time:')
    this.timeLabel = this.createDLbl(100, -120)

    const obstaclesNoText = this.createLbl(-100, -90, '# Obst:')
    this.obstaclesNoLabel = this.createDLbl(100, -90)

    const obstaclesText = this.createLbl(-100, -45, 'Obst:')
    this.obstaclesLabel = this.createDLbl(100, -45)

    const distanceText = this.createLbl(-100, -12.5, 'Dist:')
    this.distanceLabel = this.createDLbl(100, -15)

    const scoreText = this.createLbl(-100, 20, 'Score:', 24)
    this.scoreLabel = this.createDLbl(100, 15, 24)

    const retryBtn = new Button(this.game, -75, 100, 'buttonSmall', 'retry', 24)
    this.add(retryBtn)
    retryBtn.onInputUp.add(() => this.game.state.start('Main'))

    const menuBtn = new Button(this.game, 75, 100, 'buttonSmall', 'menu', 24)
    this.add(menuBtn)
    menuBtn.onInputUp.add(() => this.game.state.start('MainMenu'))

    this.vals = {}
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

  show (score, stats, coefs) {
    this.vals = {
      time: 0,
      obstacleCount: 0,
      obstacles: 0,
      distance: 0,
      score: 0,
    }
    const vals = {
      time: Math.floor(stats.time),
      obstacleCount: Math.floor(stats.obstacles),
      obstacles: Math.floor(score.obstacles),
      distance: Math.floor(score.distance),
      score: Math.floor(score.total),
    }
    const scoreTween = this.game.add.tween(this.vals).to(vals, 500)

    scoreTween.onUpdateCallback(this.updateLabels, this)
    scoreTween.onComplete.add(this.updateLabels, this)

    scoreTween.start()
  }

  updateLabels () {
    this.timeLabel.text = '' + Math.floor(this.vals.time)
    this.obstaclesNoLabel.text = '' + Math.floor(this.vals.obstacleCount)
    this.obstaclesLabel.text = '' + Math.floor(this.vals.obstacles)
    this.distanceLabel.text = '' + Math.floor(this.vals.distance)
    this.scoreLabel.text = '' + Math.floor(this.vals.score)
  }
}

module.exports = EndGame
