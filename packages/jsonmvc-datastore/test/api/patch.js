'use strict'

const fs = require('fs')
const testsFile = fs.readFileSync(`${__dirname}/patch.yml`, 'utf-8')
let tests = require('yamljs').parse(testsFile)
let dbFn
if(__DEV__) {
  dbFn = require(`${__dirname}/../../src/index`).default
} else {
  dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)
}
const merge = require('lodash/merge')
const identity = x => x

const additionalProps = ['err']

// tests = [tests[tests.length - 1]]

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  if (x.expected) {
    it('should succeed: ' + x.comment, () => {
      let db = dbFn(x.doc)

      if (x.expected) {
        additionalProps.forEach(y => {
          x.expected[y] = db.get('/' + y)
        })
      }

      if (x.dynamic) {
        Object.keys(x.dynamic).forEach(y => {
          db.node(y, x.dynamic[y], identity)
        })
      }

      if (x.cache) {
        x.cache.forEach(y => {
          db.get(y)
        })
      }

      db.patch(x.patch)

      expect(db.get('/')).toEqual(x.expected)
    })
  } else if (x.error) {
    it('should fail: ' + x.comment, () => {
      let db = dbFn(x.doc)
      let before = db.get('/err/patch')

      if (x.valueFn) {
        x.patch[0].value = function () {}
      } else if (x.circular) {
        var a = {}
        var b = {}
        a.b = b
        b.a = a
        x.patch[0].value = a
      } else if (x.nonValidJson) {
        x.patch[0].value = /123/
      }

      db.patch(x.patch)

      let after = db.get('/err/patch')

      expect(after.length).toBe(before.length + 1)
    })
  }

})
