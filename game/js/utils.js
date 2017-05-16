
module.exports.clone = function clone (src) {
  return JSON.parse(JSON.stringify(src))
}
