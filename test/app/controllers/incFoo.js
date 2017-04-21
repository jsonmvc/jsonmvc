
import { stream } from '_utils'

module.exports = {
  args: {
    foo: '/foo'
  },
  fn: stream
    .delay(1000)
    .map(x => x.foo + 2)
    .map(x => ({
      op: 'add',
      path: '/foo',
      value: x
    }))
}
