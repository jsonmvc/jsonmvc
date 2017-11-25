'use strict'

// @TODO: Add test when a listener cache returns undefined

jest.useFakeTimers()

const isObjectLike = require('lodash/isObjectLike')
const isArray = require('lodash/isArray')
const fs = require('fs')
const testsFile = fs.readFileSync(`${__dirname}/on.yml`, 'utf-8')
let tests = require('yamljs').parse(testsFile)

let dbFn
if(__DEV__) {
  dbFn = require(`${__dirname}/../../src/index`).default
} else {
  dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)
}

const Promise = require('promise')
const decomposePath = require(`${__dirname}/../../src/fn/decomposePath`).default

const additionalProps = ['err']

// tests = [tests[tests.length - 19]]

// tests = tests.filter(x => x.comment === 'Two dynamic nodes with two paths')

require('setimmediate')

const delayed = fn => {
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(fn())
    })
  })
}

const undefinedFn = x => undefined
const errFn = x => {
  throw new Error('This is an error')
}
const noArgsFn = () => undefined

const identity = x => x

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fns = {}
    let dynamicFns = {}

    if (x.dynamic) {
      let ys = Object.keys(x.dynamic)
      ys.forEach((y, i) => {
        let fn
        let len = x.dynamic[y].length

        if (len === 1) {
          fn = x => x
        } else if (len === 2) {
          fn = (x, y) => [x, y]
        } else if (len === 3) {
          fn = (x, y, z) => [x, y, z]
        } else if (len === 4) {
          fn = (x, y, z, t) => [x, y, z, t]
        }

        db.node(y, x.dynamic[y], fn)
        dynamicFns[y] = fn
      })
    }

    if (x.cache) {
      x.cache.forEach(y => {
        db.get(y)
      })
    }

    let unsubscribes = []

    x.listeners.forEach(y => {
      let unsubscribe
      if (x.errFn) {
        unsubscribe = db.on(y, errFn)
      } else if (x.invalidFn) {
        unsubscribe = db.on(y, 123)
      } else if (x.noArgsFn) {
        unsubscribe = db.on(y, noArgsFn)
      } else {
        fns[y] = jest.fn()
        unsubscribe = db.on(y, x => {
          fns[y](x, db.get(y), y)
        })
      }
      unsubscribes.push(unsubscribe)
    })

    if (x.unsubscribe === true) {
      setTimeout(() => {
        unsubscribes.forEach(y => {
          y()
        })
      })
    }

    if (x.patch) {
      if (x.async) {
        x.patch.forEach((x, i) => {
          setTimeout(() => {
            db.patch([x])
          }, i * 10)
        })
      } else {
        db.patch(x.patch)
      }
    }

    jest.runAllTimers()

    return delayed(() => {
      if (x.errFn || x.invalidFn || x.noArgsFn) {
        expect(db.get('/err/on').length).toBe(1)
      } else {

        if (x.expectDoc) {

          // Test the current document to the expected
          // one - this is useful to ensure caching
          // is properly cleared
          function recurseTest(cur, path) {

            if (!path) {
              path = '/'

              let doc = db.get(path)
              additionalProps.forEach(x => {
                delete doc[x]
              })
              expect(doc).toEqual(cur)
            } else {
              expect(cur).toEqual(db.get(path))
            }

            if (isArray(cur)) {

              cur.forEach((x, index) => {
                let curPath = path + '/' + index
                let el = db.get(curPath)
                expect(el).toEqual(x)

                if (isObjectLike(x)) {
                  recurseTest(x, curPath)
                }
              })

            } else if (isObjectLike(cur)) {

              Object.keys(cur).forEach(x => {
                let curPath = path === '/' ? '/' + x : path + '/' + x
                let el = db.get(curPath)

                expect(el).toEqual(cur[x])

                if (isObjectLike(cur[x])) {
                  recurseTest(cur[x], curPath)
                }
              })

            }

          }

          recurseTest(x.expectDoc)

        }

        if (x.unsubscribe !== true) {
          x.listeners.forEach(y => {
            let calls = fns[y].mock.calls

            // Test all values match up
            calls.forEach(x => {
              expect(x[0]).toEqual(x[1])
            })

            let last = calls[calls.length - 1]

            if (!last) {
              return
            }

            let path = last[2]

            let parts = decomposePath(path)

            let dynamicParent

            parts.forEach(y => {
              if (x.dynamic && x.dynamic[y]) {
                dynamicParent = y
              }
            })

            // The last listener called must match the current
            // value if the path is a dynamic node
            if (x.dynamic && (x.dynamic[y] || dynamicParent)) {
              let loc = dynamicParent ? dynamicParent : y
              let node = x.dynamic[loc]
              let args = node.reduce((acc, x) => {
                acc.push(db.get(x))
                return acc
              }, [])

              let result = dynamicFns[loc].apply(null, args)

              if (dynamicParent) {
                let childParts = y.split('/')
                childParts.shift()

                let parentParts = dynamicParent.split('/')
                parentParts.shift()

                parentParts.forEach(x => {
                  childParts.shift()
                })

                childParts.forEach(x => {
                  if (result) {
                    result = result[x]
                  } else {
                    result = undefined
                  }
                })

              }

              if (last[0] === null && result === undefined) {
                // The node will always return null if it can't
                // compute or it's values are undefined
              } else {
                expect(last[0]).toEqual(result)
              }

            } else if (last) {
              let parts = path.split('/')
              parts.shift()

              let val = db.get('/')
              while (parts.length > 0 && parts[0] !== '') {
                let prop = parts.shift()
                if (val) {
                  val = val[prop]
                } else {
                  val = void 0
                  break
                }
              }

              expect(last[0]).toEqual(val)
            }

          })
        }

        if (x.async && x.unsubscribe !== true) {
          let result

          x.listeners.forEach(y => {
            result = fns[y].mock.calls.reduce((acc, x) => {
              acc[x[2]] = x[0]
              return acc
            }, {})
          })

          Object.keys(result).forEach(x => {
            expect(result[x]).toEqual(db.get(x))
          })

        } else {
          let callsNo = Object.keys(fns).reduce((acc, x) => {
            acc += fns[x].mock.calls.length
            return acc
          }, 0)
          expect(callsNo).toBe(x.listeners.length)
        }
      }
    })
  })

})
