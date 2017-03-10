
import { merge, isArray, reduce } from 'lodash'
import * as most from 'most'
import Observable from 'zen-observable'

/**
 * Libs
 */
const libContext = require.context('_libs/', true, /\.js/)
const libs = libContext.keys().reduce((acc, x) => {
  let name = new RegExp(/^\.\/([a-z0-9]+)/gi).exec(x)[1]
  acc[name] = libContext(x)
  return acc
}, {})

const lib = db => {
  return reduce(libs, (acc, fn, k) => {
    acc[k] = fn(db)
    return acc
  }, {})
}

function createController(db, controller, name) {
  let off = () => {}

  let observable = new Observable(observer => {
    let unsub = db.on(controller.args, x => observer.next(x))
    off = () => {
      unsub()
      observer.complete()
    }
  })

  return merge(controller, {
    result: controller.stream(most.from(observable), lib(db)),
    off: off
  })
}

module.exports = createController
