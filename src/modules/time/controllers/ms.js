import * as most from 'most'

module.exports = {
  args: {
    interval: '/config/time/interval'
  },
  fn: stream => stream
    .chain(x => most.periodic(x.interval))
    .map(x => new Date().getTime())
    .map(x => ({
      op: 'add',
      path: '/time/ms',
      value: x
    }))
}
