import * as most from 'most'

module.exports = {
  args: '/config/time/interval',
  stream: stream => stream
    .chain(x => most.periodic(x))
    .map(x => new Date().getTime())
    .map(x => ({
      op: 'add',
      path: '/time/ms',
      value: x
    }))
}
