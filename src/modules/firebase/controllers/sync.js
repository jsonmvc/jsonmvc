import forEach from 'lodash/forEach'
import isPlainObject from 'lodash/isPlainObject'


// @TODO: Add a buffer for the firebase stream for 10ms or so

function unsyncData(key, handles) {

}

function syncData(db, observer, errFn, key, val) {
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
}

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
        let handles

        if (val.auth === true) {
          lib.on('/firebase/isAuth', y => {
            if (y === true) {
              handles = syncData(db, observer, errFn, key, val)
            } else {
              unsyncData(key, handles)
            }
          })
        } else {
          syncData(db, observer, errFn, key, val)
        }
      })
    }))
}
