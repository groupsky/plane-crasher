/* global Cocoon */
class AdMobPlugin extends Phaser.Plugin {
  constructor (game, parent) {
    super(game, parent)

    if(this.game.isCocoon) {
      setTimeout(function() {
        Cocoon.Ad.AdMob.configure({
          android: {
            banner:'ca-app-pub-1942686196954551/5542624829',
            interstitial: 'ca-app-pub-1942686196954551/9582544827',
            reward: 'ca-app-pub-1942686196954551/2059278029'
          }
        })

        this.banner = Cocoon.Ad.AdMob.createBanner()
        this.banner.setLayout(Cocoon.Ad.BannerLayout.BOTTOM_CENTER)
        this.banner.on('load', () => {
           console.log('Banner loaded ' + this.banner.width, this.banner.height)
        })
        this.banner.on('fail', () => {
           console.log('Banner failed to load')
        })
        this.banner.on('show', () => {
           console.log('Banner shown a modal content')
        })
        this.banner.on('dismiss', function(){
           console.log('Banner dismissed the modal content')
        })
        this.banner.on('click', () => {
           console.log('Banner clicked')
        })
        
        
        

        this.interstitial = Cocoon.Ad.AdMob.createInterstitial()
        // this.interstitial = Cocoon.Ad.AdMob.createRewardedVideo('ca-app-pub-1942686196954551/2059278029')
        this.interstitial.on('load', () => {
           console.log('Interstitial loaded ')
        })
        this.interstitial.on('fail', (params) => {
           console.log('Interstitial failed to load ')
        })
        this.interstitial.on('show', () => {
           console.log('Interstitial shown a modal content')
        })
        this.interstitial.on('dismiss', function(){
           console.log('Interstitial dismissed the modal content')
        })
        this.interstitial.on('click', () => {
           console.log('Interstitial clicked')
        })

        this.reward = Cocoon.Ad.AdMob.createRewardedVideo()
        this.reward.on('load', () => {
           console.log('Reward loaded ')
        })
        this.reward.on('fail', (params) => {
           console.log('Reward failed to load ')
        })
        this.reward.on('show', () => {
           console.log('Reward shown a modal content')
        })
        this.reward.on('dismiss', function(){
           console.log('Reward dismissed the modal content')
        })
        this.reward.on('click', () => {
           console.log('Reward clicked')
        })

        

        this.banner.load()
        this.interstitial.load()
        this.reward.load()

      }.bind(this), 1000)
    }
  }

  showBanner() {
    if(this.game.isCocoon) {
      this.banner.show()  
    }
  }

  hideBanner() {
    if(this.game.isCocoon) {
      this.banner.hide()
    }
  }

  showInterstitial() {
    if(this.game.isCocoon) {
      this.interstitial.show()
    }
  }

  hideInterstitial() {
    if(this.game.isCocoon) {
      this.interstitial.hide()
    }
  }

  showReward() {
    if(this.game.isCocoon) {
      this.reward.show()
    }
  }

  hideReward() {
    if(this.game.isCocoon) {
      this.reward.hide()
    }
  }
}

AdMobPlugin.configure = function () {
  return AdMobPlugin
}

module.exports = AdMobPlugin
