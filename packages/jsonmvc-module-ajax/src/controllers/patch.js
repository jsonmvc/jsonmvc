
import { stream, observer } from './../../../utils/index'

const controller = {
  args: {
    requests: '/ajax/toPatch'
  },
  fn: stream
    .chain(args => observer(o => {
      let requests = args.requests

      Object.keys(requests).map(x => {
        let request = requests[x]
        let patch = request.response

        o.next(patch)
        o.next({
          op: 'add',
          path: `/ajax/data/${request.id}/patchedAt`,
          value: new Date().getTime()
        })
      })
    }))
}

export default controller
