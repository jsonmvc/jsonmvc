import { stream, observer } from './../../../utils/index'

const controller = {
  args: {
    path: '/firebase/signOut/path'
  },
  fn: stream
    .filter(x => !!x.path)
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

export default controller
