/* global Phaser, SlickUI */

const Button = require('../ui/Button')
const ImageButton = require('../ui/ImageButton')
const Plane = require('../actors/Plane')
const TopBar = require('../actors/TopBar')
const IdleGains = require('../actors/IdleGains')
const styles = require('../ui/styles')

class MainMenu extends Phaser.State {
  init () {
    this.stage.disableVisibilityChange = true
  }

  preload () { }

  create () {
    const topBar = new TopBar(this.game)

    // scrolling background
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sheet', 'background')
    this.background.autoScroll(-100, 0)

    this.plane = new Plane(this.game, this.world.centerX, topBar.height + 30, 'planeGreen')
    this.plane.anchor.set(0.5)
    this.plane.position.y += this.plane.height / 2
    this.plane.angle = -20
    this.add.tween(this.plane).to({ angle: 20 }, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true)
    this.add.existing(this.plane)

    let logo = this.add.image(this.world.centerX, 180, 'sheet', 'logo')
    logo.anchor.set(0.5)

    this.startBtn = new Button(this.game, this.world.width / 4, this.world.centerY, 'Play', styles.btnLargeMain)
    this.startBtn.onInputUp.add(this.startGame, this)
    this.startBtn.position.x = this.world.width / 2 - logo.width / 2 + this.startBtn.width / 2
    this.startBtn.position.y = this.world.centerY + this.startBtn.height / 2

    this.upgradesBtn = new Button(this.game, this.world.width / 4, 400, 'Upgrade', styles.btnLarge)
    this.upgradesBtn.onInputUp.add(() => this.game.state.start('Upgrades'))
    this.upgradesBtn.position.x = this.world.width / 2 - logo.width / 2 + this.upgradesBtn.width / 2
    this.upgradesBtn.position.y = this.startBtn.position.y + this.upgradesBtn.height + 30

    this.botsBtn = new Button(this.game, this.world.width * 3 / 4, 300, 'Bots', styles.btnLarge)
    this.botsBtn.onInputUp.add(() => {
      if (this.game.idle.idleEngine.botLevel() > 0) {
        this.game.state.start('Bots')
      }
    })
    this.botsBtn.disabled = this.game.idle.idleEngine.botLevel() === 0
    this.botsBtn.position.x = this.world.width / 2 + logo.width / 2 - this.botsBtn.width / 2
    this.botsBtn.position.y = this.world.centerY + this.botsBtn.height / 2

    this.statsBtn = new Button(this.game, this.world.width * 3 / 4, 400, 'Stats', styles.btnLarge)
    this.statsBtn.onInputUp.add(() => this.game.state.start('Stats'))
    this.statsBtn.position.x = this.world.width / 2 + logo.width / 2 - +this.statsBtn.width / 2
    this.statsBtn.position.y = this.botsBtn.position.y + this.statsBtn.height + 30

    this.soundBtn = new ImageButton(this.game, this.world.width - 10, this.world.height - 10, 'ui', 'audioOn', styles.btnSmall)
    this.soundBtn.x -= this.soundBtn.width * 0.5
    this.soundBtn.y -= this.soundBtn.height * 0.5
    this.soundBtn.onInputUp.add(() => {
      if (this.game.sound.mute) {
        this.game.sound.mute = false
        this.game.idle.idleEngine.settings.mute = false
        this.soundBtn.setImage('ui', 'audioOn')
      } else {
        this.game.sound.mute = true
        this.game.idle.idleEngine.settings.mute = true
        this.soundBtn.setImage('ui', 'audioOff')
      }
      this.game.idle.save()
    })

    this.game.sound.mute = this.game.idle.idleEngine.settings.mute
    if (this.game.sound.mute) {
      this.soundBtn.setImage('ui', 'audioOff')
    }

    if (this.game.isBrowser) {
      this.fullBtn = new ImageButton(this.game, this.world.width - this.soundBtn.width - 20, this.world.height - 10, 'ui', 'larger', styles.btnSmall)
      this.fullBtn.onInputUp.add(() => {
        if (this.game.scale.isFullScreen) {
          this.game.scale.stopFullScreen()
          this.fullBtn.setImage('ui', 'larger')
        } else {
          this.game.scale.startFullScreen(false)
          this.fullBtn.setImage('ui', 'smaller')
        }
      })
      // fullBtn.scale.set(0.15, 0.25)
      this.fullBtn.x -= this.fullBtn.width * 0.5
      this.fullBtn.y -= this.fullBtn.height * 0.5
    }

    if (this.game.idle.idleEngine.idleGain) {
      this.startBtn.visible = false
      this.upgradesBtn.visible = false
      this.botsBtn.visible = false
      this.statsBtn.visible = false
      this.idleGains = new IdleGains(this.game, undefined, this.world.centerX, this.world.centerY)
      this.add.existing(this.idleGains)
      this.idleGains.onContinue.add(() => {
        this.idleGains.destroy()
        this.startBtn.visible = true
        this.upgradesBtn.visible = true
        this.game.idle.idleEngine.idleGain = false
        this.botsBtn.visible = true
        this.statsBtn.visible = true
      })
    }

    this.add.existing(topBar)
    this.world.bringToTop(topBar)
  }

  render () { }

  shutdown () {
    this.plane.destroy()
    this.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
  }

  startGame () {
    this.game.state.start('Main')
  }

  shutdown () {
    this.stage.disableVisibilityChange = false
  }

  update() {
    if(this.game.isBrowser) {
      if (this.game.scale.isFullScreen) {
        this.fullBtn.setImage('ui', 'smaller')
      } else {
        this.fullBtn.setImage('ui', 'larger')
      }
    }
  }
}

module.exports = MainMenu
