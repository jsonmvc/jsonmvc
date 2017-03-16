
module.exports = {
  path: '/time/mm',
  args: ['/time/ms'],
  fn: x => x - (x % (60 * 1000))
}
