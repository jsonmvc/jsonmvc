'use strict'

const fs = require('fs')
const testsFile = fs.readFileSync(__dirname + '/db.yml', 'utf-8')
const tests = require('yamljs').parse(testsFile)

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

const errFn = () => {
  throw new Error('This is an error')
}

const identity = x => x

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db

    db = dbFn(x.doc)

    if (x.error) {
      let name = db.get(`${x.error}/name`)

      let err = db.get(`/err/${name}`)

      expect(err.length).toBe(1)
      expect(err[0].id).toBe(x.error)
    } else {
      expect(db.get('/')).toEqual(x.expected)
    }
  })

})