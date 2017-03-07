
import { isArray } from 'lodash'
import * as most from 'most'
import Observable from 'zen-observable'

import lib from '_lib'

function createController(db, name, controller, path) {
  let dataUnsubscribes = []

  let observable = new Observable(observer => {
    dataUnsubscribes.push(db.on(path, x => {
      observer.next(x)
    }))
  })

  let inStream = most.from(observable)
  let cLib = lib(`controllers:${name}`, db)

  let outStream = controller(inStream, cLib)

  let streamUnsubscribe = outStream.subscribe({
    next: x => {
      if (x && !isArray(x)) {
        x = [x]
      }
      db.patch(x)
    },
    complete: x => {
      console.log(`Controller ${name} has ended`)
    },
    error: x => {
      console.error(`Controller ${name} has an error`, x)
    }
  })

  return function unsubscribeController() {
    dataUnsubscribes.forEach(x => {
      x()
    })
    streamUnsubscribe.unsubscribe()
  }
}

module.exports = createController
