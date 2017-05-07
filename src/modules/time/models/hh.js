
module.exports = {
  path: '/time/hh',
  args: {
    mm: '/time/mm'
  },
  fn: args => args.mm - (args.mm % (60 * 60 * 1000))
}
