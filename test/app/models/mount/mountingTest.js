
module.exports = {
  path: '/shouldMount/mounting-test',
  args: {
    foo: '/foo'
  },
  fn: args => {
    if (args.foo > 125 && args.foo < 130) {
      return true
    } else {
      return false
    }
  }
}
