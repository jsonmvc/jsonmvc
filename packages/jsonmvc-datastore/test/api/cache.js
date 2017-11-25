'use strict'

const fs = require('fs')
const testsFile = fs.readFileSync(`${__dirname}/cache.yml`, 'utf-8')
let tests = require('yamljs').parse(testsFile)

// tests = [tests[tests.length - 1]]

const merge = require('lodash/merge')
let dbFn
if(__DEV__) {
  dbFn = require(`${__dirname}/../../src/index`).default
} else {
  dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)
}

const concat = function () {
  return Array.prototype.join.call(arguments, '-')
}

const undefinedFn = () => undefined
const falseFn = () => false
const errFn = () => {
  throw new Error('This is an error')
}

const identity = x => x

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fn = jest.fn()

    if (x.dynamic) {
      let ys = Object.keys(x.dynamic)
      ys.forEach((y, i) => {
        let fn
        let len = x.dynamic[y].length
        let toCall

        if (x.undefinedFn) {
          toCall = undefinedFn
        } else if (x.errFn) {
          toCall = errFn
        } else if (x.falseFn && x.falseFn[y]) {
          toCall = falseFn
        }

        if (len === 1) {
          fn = x => toCall ? toCall() : x
        } else if (len === 2) {
          fn = (x, y) => toCall ? toCall() : `${x}-${y}`
        } else if (len === 3) {
          fn = (x, y, z) => toCall ? toCall() : `${x}-${y}-${z}`
        } else if (len === 4) {
          fn = (x, y, z, t) => toCall ? toCall() : `${x}-${y}-${z}-${t}`
        }

        db.node(y, x.dynamic[y], fn)
      })
    }

    for (let i in x.expectPaths) {
      let val = db.get(i)
    }

    db.patch(x.patch)

    for (let i in x.expectPaths) {
      let expected = x.expectPaths[i] === 'undefined' ? undefined : x.expectPaths[i]
      let val = db.get(i)
      expect(val).toBe(expected)
    }

  })

})
