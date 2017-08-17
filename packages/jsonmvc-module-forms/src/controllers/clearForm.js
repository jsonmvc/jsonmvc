import map from 'lodash-es/map'
import isEmpty from 'lodash-es/isEmpty'
import stream from 'jsonmvc-helper-stream'

const controller = {
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

export default controller
