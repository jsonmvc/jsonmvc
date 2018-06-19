
import Observable from 'zen-observable'

import libGet from './../fns/lib-get'
import libOn from './../fns/lib-on'

const lib = db => {
  return {
    get: libGet(db),
    on: libOn(db)
  }
}

function buildObservable (source, lib, ops) {
  ops.forEach(x => {
    let op = x[0]
    let args = x[1]
    args = Array.prototype.slice.call(args)
    if (_.isFunction(args[0])) {
      let fn = args[0]
      args[0] = function controllerWrapperFn () {
        let fnArgs = Array.prototype.slice.call(arguments)
        fnArgs.push(lib)
        return fn.apply(null, fnArgs)
      }
    }
    source = source[op].apply(source, args)
  })

  return source
}

function createController (db, controller, name) {
  let off = () => {}

  if (!controller.args || !controller.fn) {
    throw new Error(`Controller [${name}] should look like:
      --
      {
        args: Object,
        fn: Function | Observable
      }
      --
      example:
      {
        args: {
          foo: '/bam/bar/foo',
          baz: '/boo/baz'
        },
        fn: args => {
          args.foo // The value at /bam/bar/foo
          args.baz // => /boo/baz
        }
      }
`)
  }

  let observable = new Observable(observer => {
    let keys = Object.keys(controller.args)

    let args = keys.reduce((acc, x) => {
      acc[x] = undefined
      return acc
    }, {})

    let unsubs = keys.map(key => {
      return db.on(controller.args[key], val => {
        args[key] = val
        observer.next(_.cloneDeep(args))
      })
    })

    off = () => {
      unsubs.forEach(x => {
        x()
      })
      observer.complete()
    }
  })

  let ops = []

  if (_.isFunction(controller.fn)) {
    ops.push(['map', [controller.fn]])
  } else if (_.isObject(controller.fn) && controller.fn['__instance__'] && !_.isEmpty(controller.fn['__instance__'].op)) {
    ops = controller.fn['__instance__'].op
  } else {
    throw new Error('Controller fn is neither a function nor an observable placeholder')
  }

  let internalLib = lib(db)

  controller.name = name
  controller.result = buildObservable(most.from(observable), internalLib, ops)
  controller.off = off
}

export default createController
