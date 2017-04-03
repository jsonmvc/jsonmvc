import { map, isEmpty } from 'lodash'

module.exports = {
  args: '/forms/submit/qux',
  stream: (stream, lib) => stream
    .filter(x => !isEmpty(x))
    .map(x => {
      return map(x, (val, key) => ({
        op: 'remove',
        path: '/qux/edit/' + key
      }))
    })
}

