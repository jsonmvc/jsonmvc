'use strict'

const fs = require('fs')
const testsFile = fs.readFileSync(`${__dirname}/get.yml`, 'utf-8')
let tests = require('yamljs').parse(testsFile)

// tests = [tests[tests.length - 1]]

const merge = require('lodash/merge')
const dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)

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

    if (x.get === "undefined" ) {
      x.get = undefined
    } else if (x.get === '/') {
      x.expect = merge(db.get('/'), x.expect)
    }

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

    let val = db.get(x.get)

    if (x.errFn) {
      expect(db.get('/err/node').length).toBe(1)
    }

    if (x.reference) {
      let before = db.get(x.get + '/' + x.reference)
      val[x.reference] = 'something else'
      let after = db.get(x.get + '/' + x.reference)
      expect(after).toEqual(before)
    } else {
      let val = db.get(x.get)

      if (val === undefined && x.expect === "undefined") {
        val = "undefined"
      }

      expect(val).toEqual(x.expect)
    }


  })

})
