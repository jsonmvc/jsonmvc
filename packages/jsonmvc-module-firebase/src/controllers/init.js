import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

const controller = {
  args: {
    config: '/firebase/config'
  },
  fn: stream
    .filter(x => !!x.config)
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

export default controller
