
import { stream, observer } from '_utils'

module.exports = {
  args: {
    baz: '/bar/baz'
  },
  fn: stream
    .chain(x => observer(o => {
      o.next({
        op: 'add',
        path: '/observable',
        value: 'works!'
      })
    }))
}
