import firebase from 'firebase'
import { stream, observer } from '_utils'

module.exports = {
  args: {
    config: '/firebase/config'
  },
  fn: stream
    .chain(x => observer(o => {

      if (!window.firebase) {
        window.firebase = firebase
        firebase.initializeApp(x.config)
        o.next({
          op: 'add',
          path: '/firebase/init',
          value: true
        })
      }

    }))
}
