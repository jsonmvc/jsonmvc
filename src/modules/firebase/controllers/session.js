
import { stream, observer } from '_utils'

module.exports = {
  args: {
    config: '/firebase/config'
  },
  fn: stream
    .chain(x => observer(o => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          o.next({
            op: 'add',
            path: '/firebase/session/isValid',
            value: true
          })
        } else {
          o.next({
            op: 'add',
            path: '/firebase/session/isValid',
            value: false
          })
        }
      })
    }))
}
