
import Observable from 'zen-observable'
import * as most from 'most'

module.exports = {
  args: ['/ajax/toPatch'],
  stream: stream => stream
    .chain(requests => {

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
