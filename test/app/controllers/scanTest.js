
import { stream } from '_utils'

module.exports = {
  args: {
    time: '/time/ms'
  },
  fn: stream
    .map(args => args.time)
    .filter(x => !!x)
    .scan((x, y, lib) => {
      if (y == undefined || x == undefined) {
        return 0
      }
      return y - x
    })
    .map(x => Math.floor(x / 1000))
    .map(x => ({
      op: 'add',
      path: '/timeElapsed',
      value: x
    }))
}
