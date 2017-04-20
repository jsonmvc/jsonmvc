import { map, isEmpty } from 'lodash'

module.exports = {
  args: {
    qux: '/forms/submit/qux'
  },
  fn: (stream, lib) => stream
    .filter(x => !isEmpty(x.qux))
    .map(x => {
      return map(x.qux, (val, key) => ({
        op: 'remove',
        path: '/qux/edit/' + key
      }))
    })
}

