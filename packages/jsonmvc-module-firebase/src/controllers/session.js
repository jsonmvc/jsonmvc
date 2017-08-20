import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

const controller = {
  args: {
    config: '/firebase/config'
  },
  fn: stream
    .filter(x => !!x.config)
    .chain(x => observer(o => {
      firebase.auth().onAuthStateChanged(function (user) {
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

export default controller
