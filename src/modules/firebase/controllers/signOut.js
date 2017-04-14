
module.exports = {
  args: '/firebase/signOut/path',
  stream: (stream, lib) => stream
    .chain(x => lib.observable(observer => {

      lib.on(x, y => {

        firebase.auth().signOut()
          .catch(function(error) {
            observer.next({
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

