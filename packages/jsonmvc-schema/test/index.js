
import Promise from 'promise'

const fs = require('fs')
const yaml = require('js-yaml')
const defaults = require('json-schema-defaults')

let lib
let jsonmvc
if(__DEV__) {
  lib = require('./../src/index')
  jsonmvc = require('./../../jsonmvc/src/index.js').default
} else {
  lib = require('./../dist/index')
  jsonmvc = require('jsonmvc')
}

jest.useFakeTimers()

it('should compose a nested schema', () => {
  let placeholders = {
    '__SAMPLE_PLACEHOLDER__': 123
  }
  return lib.buildSchema(__dirname + '/schema/app.yml', placeholders).then(x => {
    let expectedSchema = yaml.safeLoad(fs.readFileSync(__dirname + '/schema/app.expected.yml', 'utf-8'))

    expect(x).toEqual(expectedSchema)
  }).catch(e => {
    throw e
  })
})

it('should create models for fields', () => {
  let schema = yaml.safeLoad(fs.readFileSync(__dirname + '/schema/fields.schema.yml', 'utf-8'))
  let initial = defaults(schema)
  let models = lib.buildValidation(schema, initial)

  let app = {
    controllers: [],
    models: Object.keys(models).map(x => models[x]),
    views: [],
    data: initial
  }

  let instance = jsonmvc(app)
  jest.runOnlyPendingTimers()

  let db = instance.db

  let errors = '/foo/action/errors'
  let fieldError = '/foo/action/data/bar/baz/error' 

  expect(db.get(errors)).toBe(null)
  expect(db.get(fieldError)).toBe(null)

  db.patch([{
    op: 'add',
    path: '/foo/action/data/bar/baz/value',
    value: 'aaaa'
  }])
  jest.runOnlyPendingTimers()

  expect(db.get(fieldError + '/keyword')).toBe('type')
  expect(db.get(errors)).toBe(null)

  db.patch([{
    op: 'add',
    path: '/foo/action/submit',
    value: Date.now()
  }])
  jest.runOnlyPendingTimers()

  expect(db.get(errors).length).toBe(1)

  db.patch([{
    op: 'add',
    path: '/foo/action/data/bar/baz/value',
    value: 123
  }])
  jest.runOnlyPendingTimers()

  expect(db.get(fieldError)).toBe(null)
  expect(db.get(errors)).toBe(null)
})