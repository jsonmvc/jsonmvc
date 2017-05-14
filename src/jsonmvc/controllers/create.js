
import { isObject, isEmpty, isFunction, isArray, reduce, cloneDeep } from 'lodash'
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


function buildObservable(source, lib, ops) {

  ops.forEach(x => {
    let op = x[0]
    let args = x[1]
    args = Array.prototype.slice.call(args)
    if (isFunction(args[0])) {
      let fn = args[0]
      args[0] = function controllerWrapperFn() {
        let fnArgs = Array.prototype.slice.call(arguments)
        fnArgs.push(lib)
        return fn.apply(null, fnArgs)
      }
    }
    source = source[op].apply(source, args)
  })

  return source
}

function createController(db, controller, name) {
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
        observer.next(cloneDeep(args))
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

  if (isFunction(controller.fn)) {
    ops.push(['map', [controller.fn]])
  } else if (isObject(controller.fn) && controller.fn['__instance__'] && !isEmpty(controller.fn['__instance__'].op)) {
    ops = controller.fn['__instance__'].op
  } else {
    throw new Error('Controller fn is neither a function nor an observable placeholder')
  }

  let internalLib = lib(db)

  controller.name = name
  controller.result = buildObservable(most.from(observable), internalLib, ops)
  controller.off = off
}

module.exports = createController
