import * as most from 'most'
import { stream } from './../../../utils/index'

const controller = {
  args: {
    interval: '/config/time/interval'
  },
  fn: stream
    .chain(x => most.periodic(x.interval))
    .map(x => new Date().getTime())
    .map(x => ({
      op: 'add',
      path: '/time/ms',
      value: x
    }))
}

export default controller
