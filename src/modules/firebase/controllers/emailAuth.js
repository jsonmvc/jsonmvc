
module.exports = {
  args: '/firebase/emailAuth/path',
  stream: (stream, lib) => stream
    .chain(x => lib.observable(observer => {
      lib.on(x, y => {

        firebase.auth()
          .signInWithEmailAndPassword(y.email, y.password)
          .catch(function(error) {
            observer.next({
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

