/* global Phaser */
const Button = require('./Button')
const styles = require('../ui/styles')
const Label = require('../ui/Label')

class PauseMenu extends Phaser.Group {
  constructor (game,parent) {
    super(game, parent, 'PauseMenu')

    this.x = 0
    this.y = 0
    
    this.background = this.game.add.graphics(0,0, this)
    this.background.beginFill(0x000000)
    this.background.drawRect(0,0, this.game.world.width, this.game.world.height)
    this.background.endFill()
    this.background.alpha = 0.7
    this.add(this.background)

    this.text = new Label(this.game, this.game.world.centerX, this.game.world.centerY - 100, 'Game paused', styles.labelPaused)
    this.text.anchor.set(0.5)
    this.add(this.text)

    this.resumeBtn = new Button(this.game, this.game.world.centerX, this.game.world.centerY, 'Resume', styles.btnLarge)
    this.resumeBtn.onInputDown.add(() =>{
      this.game.paused = false
      this.visible = false
    }, this)
    this.add(this.resumeBtn) 

    this.visible = false

  }

  show () {
    this.visible = true
  }

}

module.exports = PauseMenu
