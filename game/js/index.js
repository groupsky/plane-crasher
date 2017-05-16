/* global Phaser */

Phaser.Device.whenReady(() => {
  const Game = require('./Game')
  const game = new Game()
  game.state.start('Boot')
  
  if (process.env.NODE_ENV !== 'production') {
    global.game = game
  }
})
