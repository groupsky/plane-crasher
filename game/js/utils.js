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
