import { map, isEmpty } from 'lodash'

module.exports = {
  args: '/forms/clear',
  stream: (stream, lib) => stream
    .filter(x => !isEmpty(x))
    .map(x => map(x, y => ({
      op: 'remove',
      path: '/forms/data/' + y.name + '/' + y.id
    })))
}
