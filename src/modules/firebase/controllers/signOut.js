
import { stream, observer } from '_utils'
import { on } from 'jsonmvc'

module.exports = {
  args: {
    path: '/firebase/signOut/path'
  },
  fn: stream
    .chain((x, lib) => observer(o => {
      lib.on(x.path, y => {
        firebase.auth().signOut()
          .catch(function(error) {
            o.next({
              op: 'add',
              path: '/firebase/session/error',
              value: {
                code: error.code,
                message: error.message
              }
            })
          })
      })
    }))
}

