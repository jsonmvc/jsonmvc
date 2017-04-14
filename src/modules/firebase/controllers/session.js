
module.exports = {
  args: '/firebase/config',
  stream: (stream, lib) => stream
    .chain(x => lib.observable(observer => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          observer.next({
            op: 'add',
            path: '/firebase/session/isValid',
            value: true
          })
        } else {
          observer.next({
            op: 'add',
            path: '/firebase/session/isValid',
            value: false
          })
        }
      })
    }))
}
