
module.exports = {
  path: '/shouldMount/mounting-test',
  args: ['/foo'],
  fn: x => {
    if (x > 125 && x < 130) {
      return true
    } else {
      return false
    }

  }
}
