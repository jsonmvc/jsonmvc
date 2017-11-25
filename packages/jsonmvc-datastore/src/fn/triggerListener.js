
import 'setimmediate'
import getNode from './getNode'
import err from './err'

function callNode(db, path, i) {
  let fns = db.updates.fns[path]

  if (!fns || !fns[i]) {
    return
  }

  let fn = fns[i]

  let val = getNode(db, path)
  let cacheTest = JSON.stringify(val)

  if (db.updates.cache[path][i] !== cacheTest) {
    db.updates.cache[path][i] = cacheTest

    ;(function () {
      try {
        fn.call(null, val)
      } catch (e) {
        err(db, '/err/types/on/2', {
          path: path,
          error: e.message + ' ' + e.stack
        })
      }
    }())

  }
}

function triggerListener(db, path) {

  let fns = db.updates.fns[path]

  if (!fns) {
    return
  }

  let ids = Object.keys(fns)
  let len = ids.length

  for (let i = 0; i < len; i += 1) {

    setImmediate(() => {
      callNode(db, path, ids[i])
    })

  }

}

export default triggerListener
