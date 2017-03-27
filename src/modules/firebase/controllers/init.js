import firebase from 'firebase'

module.exports = {
  args: '/firebase/config',
  stream: (stream, lib) => stream
    .chain(config => lib.observable(observer => {

      window.firebase = firebase
      if (!lib.firebase()) {
        firebase.initializeApp(config)
        observer.next({
          op: 'add',
          path: '/firebase/init',
          value: true
        })
      }

    }))
}
