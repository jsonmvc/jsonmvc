
import isFunction from 'lodash-es/isFunction'
import getStaticNodes from './../fn/getStaticNodes'
import triggerListener from './../fn/triggerListener'
import decomposePath from './../fn/decomposePath'
import updateTriggers from './../fn/updateTriggers'
import patch from './patch'
import err from './../fn/err'

let listenerId = 0

/**
 * on
 *
 * Adds a listener
 *
 * - when a listener is first added a check is made
 *   on the path and if it exists then the listener
 *   is executed (async!)
 */
const on = db => (path, fn) => {
  let obj = {
    path: path,
    fn: fn
  }

  if (!isFunction(fn)) {
    err(db, '/err/types/on/1', obj)
    return
  }

  /*
  if (fn.length !== 1) {
    err(db, '/err/types/on/1', obj)
    return
  }
  */

  listenerId += 1
  if (!db.updates.fns[path]) {
    db.updates.fns[path] = {}
    db.updates.fns[path][listenerId] = fn
    db.updates.cache[path] = {}

    updateTriggers(db, path)

  } else {
    db.updates.fns[path][listenerId] = fn
  }

  triggerListener(db, path)

  let id = listenerId
  return function unsubscribe() {
    if (!db.updates.fns[path]) {
      delete db.updates.fns[path][id]
    }

    // Remove everything related to this path as no
    // more listeners exist
    if (Object.keys(db.updates.fns[path]).length === 0) {
      db.updates.fns[path] = null
      delete db.updates.fns[path]
      db.updates.cache[path] = null
      delete db.updates.cache[path]

      let triggers = db.updates.triggers
      let key
      let keys = Object.keys(triggers)
      let l = keys.length
      let i
      let arr

      while (l--) {
        key = keys[l]
        arr = triggers[key]
        i = arr.indexOf(path)

        if (i !== -1) {
          arr.splice(i, 1)
        }

        if (arr.length === 0) {
          triggers[key] = null
          delete triggers[key]
        }
      }
    }

  }
}

export default on
