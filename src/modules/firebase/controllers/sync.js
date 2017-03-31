import forEach from 'lodash/forEach'
import isPlainObject from 'lodash/isPlainObject'


module.exports = {
  args: '/firebase/init',
  stream: (stream, lib) => stream
    .filter(x => x === true)
    .chain(x => lib.observable(observer => {
      let data = lib.get('/firebase/sync')
      let db = lib.firebase().database

      function errFn(e) {
        throw e
      }

      forEach(data, (val, key) => {

        db.ref(key).on('child_added', x => {
          observer.next({
            op: 'add',
            path: `${val.path}/${x.key}`,
            value: x.val()
          })
        }, errFn)

        db.ref(key).on('child_changed', x => {
          let value = x.val()
          let op

          if (isPlainObject(value)) {
            op = 'merge'
          } else {
            op = 'replace'
          }

          observer.next({
            op: op,
            path: `${val.path}/${x.key}`,
            value: value
          })
        }, errFn)

        db.ref(key).on('child_removed', x => {
          observer.next({
            op: 'remove',
            path: `${val.path}/${x.key}`
          })
        }, errFn)

      })

    }))
}
