import { map, isEmpty } from 'lodash'
import { stream } from '_utils'

module.exports = {
  args: {
    qux: '/forms/submit/qux'
  },
  fn: stream
    .filter(x => !isEmpty(x.qux))
    .map(x => {
      return map(x.qux, (val, key) => ({
        op: 'remove',
        path: '/qux/edit/' + key
      }))
    })
}
