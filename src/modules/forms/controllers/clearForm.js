import { map, isEmpty } from 'lodash'
import { stream } from '_utils'

module.exports = {
  args: {
    clear: '/forms/clear'
  },
  fn: stream
    .filter(x => !isEmpty(x.clear))
    .map(x => map(x.clear, y => ({
      op: 'remove',
      path: '/forms/data/' + y.name + '/' + y.id
    })))
}
