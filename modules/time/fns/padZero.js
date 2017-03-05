
module.exports = function padZero(x) {
  if (x < 10) {
    x = `0${x}`
  }
  return x
}
