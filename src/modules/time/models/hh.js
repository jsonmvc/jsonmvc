
module.exports = {
  path: '/time/hh',
  args: ['/time/mm'],
  fn: x => x - (x % (60 * 60 * 1000))
}
