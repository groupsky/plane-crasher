const moment = require('moment')

// polyfill IE and phantomjs
const log10 = (() => {
  if (!!Math.log10) {
    return Math.log10
  }
  return function (val) {
    let ret = Math.log(val) / Math.LN10;
    // bloody stupid rounding errors
    ret = Math.round(ret * 1e6) / 1e6
    return ret
  }
})()

if (!Object.isObject) {
  Object.isObject = function isObject (target) {
    return typeof target === 'object'
  }
}

module.exports.clone = function clone (src) {
  return JSON.parse(JSON.stringify(src))
}

module.exports.subtract = function subtract (a, b) {
  const isArrayA = Array.isArray(a)
  const isArrayB = Array.isArray(b)
  if (isArrayA && isArrayB) {
    const r = []
    const l = Math.min(a.length, b.length)
    for (let i = 0; i < l; i++) {
      r.push(subtract(a[ i ], b[ i ]))
    }
    return r
  }
  if (isArrayA || isArrayB) {
    throw new Error('subtracting array and not array!')
  }

  const isObjectA = Object.isObject(a)
  const isObjectB = Object.isObject(b)
  if (isObjectA && isObjectB) {
    const r = {}
    for (let key in a) {
      if (!a.hasOwnProperty(key)) continue
      if (!b.hasOwnProperty(key)) {
        r[ key ] = a[ key ]
        continue
      }
      r[ key ] = subtract(a[ key ], b[ key ])
    }
    return r
  }
  if (isObjectA || isObjectB) {
    throw new Error('subtracting object and not object!')
  }

  if (a === undefined) throw new Error('subtracting from undefined!')
  if (b === undefined) return a
  if (a === null) throw new Error('subtracting from null!')
  if (b === null) return a
  return a - b
}

module.exports.formatDuration = function (timeInMs, zeroLabel) {
  if (timeInMs < 60000) {
    const sec = Math.floor(timeInMs / 1000)
    if (sec === 0) return zeroLabel || 'immediately'
    if (sec === 1) return 'a second'
    return sec + ' seconds'
  }
  return moment.duration(timeInMs).humanize()
}

const powers = [
  'k', 'm', 'g', 't',
  'a', 'b', 'c', 'd', 'e', 'f',
  'aa', 'ab', 'ac', 'ad', 'ae', 'af' ]
module.exports.formatNumber = function (number, opts) {
  const idx = Math.max(0, Math.floor(log10(Math.abs(number)) / 3)) - 1
  let numb
  if (idx >= 0 && idx < powers.length) {
    numb = Math.floor(number / Math.pow(1000, idx + 1)) + powers[ idx ]
  } else {
    numb = Math.floor(number)
  }

  return '' +
    ((opts && opts.prefix && (opts.prefix)) || '') +
    numb +
    ((opts && opts.suffix && (opts.suffix)) || '')
}

module.exports.formatNumber.gold = {
  suffix: '¤'
}

module.exports.formatNumber.distance = {
  suffix: 'm'
}
