
module.exports = {
  path: '/ajax/ids',
  args: {
    data: '/ajax/data'
  },
  fn: args => {
    if (args.data) {
      return Object.keys(args.data)
    } else {
      return []
    }
  }
}
