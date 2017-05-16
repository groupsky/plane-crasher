class Manager {
  constructor (game, parent, constructor) {
    this.game = game
    this.items = []
    this._constructor = constructor
  }

  init (state) {
    for (let i = state.length; i--;) {
      let args = state[ i ]
      if (Array.isArray(args)) {
        args.unshift(undefined)
      } else {
        args = [ undefined, args ]
      }
      this.add.apply(this, args)
    }
  }

  save () {
    const res = []
    for (let i = this.items.length; i--;) {
      res.push(this.items[ i ].save())
    }
    return res
  }

  add (item) {
    if (item === undefined) item = this._constructor

    if (typeof item === 'function') {
      //noinspection Eslint
      item = new item(this.game, this)
    } else {
      item.game = this.game
      item.parent = this
    }

    if (typeof item[ 'update' ] === 'function') {
      item.hasUpdate = true
    }

    if (item.hasUpdate) {
      item.active = true
    }

    if (typeof item[ 'init' ] === 'function') {
      const args = Array.prototype.slice.call(arguments, 1)
      item.init.apply(item, args)
    }

    this.items.push(item)

    return item
  }

  remove (item, destroy) {
    if (destroy === undefined) destroy = true

    let i = this.items.length
    while (i--) {
      if (this.items[ i ] === item) {
        if (destroy) {
          item.destroy()
        }
        this.items.splice(i, 1)
        return
      }
    }
  }

  removeAll (destroy) {
    if (destroy === undefined) destroy = true

    if (destroy) {
      let i = this.items.length
      while (i--) {
        this.items[ i ].destroy()
      }
    }

    this.items.length = 0
  }

  update () {
    let i = this.items.length
    while (i--) {
      if (this.items[ i ].active && this.items[ i ].hasUpdate) {
        this.items[ i ].update()
      }
    }
  }

  destroy () {
    this.removeAll(true)

    this.game = null
  }
}

module.exports = Manager
