
import * as most from 'most'
import Observable from 'zen-observable'
import { stream } from '_utils'

module.exports = {
  args: {
    requests: '/ajax/toPatch'
  },
  fn: stream
    .chain(args => {
      let requests = args.requests

      let observable = new Observable(observer => {

        Object.keys(requests).map(x => {
          let request = requests[x]
          let patch = request.response

          observer.next(patch)
          observer.next({
            op: 'add',
            path: `/ajax/data/${request.id}/patchedAt`,
            value: new Date().getTime()
          })
        })

      })

      return most.from(observable)
    })
}
