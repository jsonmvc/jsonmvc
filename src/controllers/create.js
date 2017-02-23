const Emitter = require('events').EventEmitter
const most = require('most')
const _ = require('lodash')

function createController(db, controller, path) {
  let emitter = new Emitter()
  let inStream = most.fromEvent('data', emitter)
  let dataUnsubscribes = []

  dataUnsubscribes.push(db.on(path, x => {
    emitter.emit('data', x)
  }))

  let outStream = controller(inStream)

  let streamUnsubscribe = outStream.subscribe({
    next: x => {
      if (x && !_.isArray(x)) {
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
