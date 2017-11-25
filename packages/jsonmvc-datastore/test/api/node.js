'use strict'

jest.useFakeTimers()

const fs = require('fs')
const testsFile = fs.readFileSync(`${__dirname}/node.yml`, 'utf-8')
let tests = require('yamljs').parse(testsFile)
let dbFn
if(__DEV__) {
  dbFn = require(`${__dirname}/../../src/index`).default
} else {
  dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)
}
const decomposePath = require(`${__dirname}/../../src/fn/decomposePath`).default
const splitPath = require(`${__dirname}/../../src/fn/splitPath`).default

// tests = [tests[tests.length - 1]]

const concat = function () {
  return Array.prototype.join.call(arguments, '-')
}

const undefinedFn = () => undefined

const invalidFn = 123

const falseFn = () => false

const nestedFn = () => {
  let x = {
    foo: {
      bar: 123
    },
    baz: {}
  }

  return x
}

const errFn = () => {
  throw new Error('This is an error')
}

const identity = x => x

tests.forEach(x => {
  let removes = []

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fn = jest.fn()
    let listeners = {}

    let ys = Object.keys(x.dynamic)
    let initial = db.get('/')

    let before = db.get('/err/node')

    // Listeners
    if (x.listeners) {
      x.listeners.forEach(y => {
        listeners[y] = jest.fn()
        db.on(y, listeners[y])
      })
    }

    ys.forEach(y => {
      let fn
      if (x.undefinedFn) {
        fn = undefinedFn
      } else if (x.errFn) {
        fn = errFn
      } else if (x.invalidFn) {
        fn = invalidFn
      } else if (x.nestedFn && x.nestedFn[y]) {
        fn = nestedFn
      } else if (x.falseFn && x.falseFn[y]) {
        fn = falseFn
      } else if (x.dynamic[y].length === 1) {
        fn = identity
      } else {
        fn = concat
      }

      removes.push(db.node(y, x.dynamic[y], fn))

      if (x.overwrite) {
        removes.push(db.node(y, x.dynamic[y], fn))
      }

    })

    let after = db.get('/err/node')

    if (x.error) {
      expect(after.length).toBeGreaterThan(0)
    } else {
      expect(after.length).toBe(0)
      ys.forEach(y => {
        expect(db.has(y)).toBe(true)
      })
    }

    if (x.listeners) {
      jest.runAllTimers()
      Object.keys(listeners).forEach(y => {
        expect(listeners[y].mock.calls.length).toBe(1)
      })
    }

    if (x.remove) {

      // Trigger cache
      db.get('/')
      ys.forEach(y => {
        db.get(y)
        decomposePath(y).forEach(x => {
          db.get(x)
        })
      })

      if (x.cache) {
        x.cache.forEach(y => {
          db.get(y)
        })
      }

      removes.forEach(x => {
        x()
      })

      ys.forEach(y => {
        expect(db.has(y)).toBe(false)
        expect(db.get(y)).toBe(undefined)

        let parents = decomposePath(y)
        parents.forEach(x => {
          let val = initial
          let xs = splitPath(x)
          while (xs.length > 0) {
            val = val[xs.shift()]
          }
          expect(db.get(x)).toEqual(val)
        })
      })

      expect(db.get('/')).toEqual(initial)

      if (x.cache) {
        x.cache.forEach(y => {
          expect(db.get(y)).toBe(undefined)
        })
      }
    }

  })

})
