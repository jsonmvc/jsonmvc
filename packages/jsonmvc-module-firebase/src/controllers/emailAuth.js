import { stream, observer } from './../../../utils/index'

const controller = {
  args: {
    path: '/firebase/emailAuth/path'
  },
  fn: stream
    .filter(x => !!x.path)
    .chain((x, lib) => observer(o => {
      lib.on(x.path, y => {
        firebase.auth()
          .signInWithEmailAndPassword(y.email, y.password)
          .catch(function(error) {
            o.next({
              op: 'add',
              path: '/firebase/emailAuth/error',
              value: {
                code: error.code,
                message: error.message
              }
            })
          })
      })
    }))
}

export default controller
