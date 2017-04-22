import forEach from 'lodash/forEach'
import isPlainObject from 'lodash/isPlainObject'
import { stream, observer } from '_utils'

// @TODO: Add a buffer for the firebase stream for 10ms or so

function unsyncData(key, handles) {

}

function syncData(db, observer, errFn, key, val) {
  let preloaded = false

  if (val.namespace) {
    key = val.namespace + '/' + key
  }

  db.ref(key).once('value', x => {
    preloaded = true
    observer.next({
      op: 'add',
      path: val.path,
      value: x.val()
    })
  })

  db.ref(key).on('child_added', x => {
    if (!preloaded) return
    observer.next({
      op: 'add',
      path: `${val.path}/${x.key}`,
      value: x.val()
    })
  }, errFn)

  db.ref(key).on('child_changed', x => {
    if (!preloaded) return
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
    if (!preloaded) return
    observer.next({
      op: 'remove',
      path: `${val.path}/${x.key}`
    })
  }, errFn)

}

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(x => x.init === true)
    .chain((x, lib) => observer(o => {
      let data = lib.get('/firebase/sync')
      let db = lib.firebase().database

      function errFn(e) {
        throw e
      }

      forEach(data, (val, key) => {
        let handles

        if (val.auth === true) {
          lib.on('/firebase/session/isValid', y => {
            if (y === true) {
              handles = syncData(db, o, errFn, key, val)
            } else {
              unsyncData(key, handles)
            }
          })
        } else {
          syncData(db, o, errFn, key, val)
        }
      })
    }))
}
