
module.exports = {
  args: ['/ajax/data'],
  path: '/ajax/ids',
  fn: x => {
    if (x) {
      return Object.keys(x)
    } else {
      return []
    }
  }
}
