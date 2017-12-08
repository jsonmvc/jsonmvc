
const derefSchema = require('./derefSchema')
const extendSchema = require('./extendSchema')
const Ajv = require('ajv')

module.exports = function resolveSchema(schema) {

  for (let i in schema.refs) {
    schema.refs[i] = derefSchema(schema.refs[i], schema.refs)
  }

  let initial
  let finish
  let inc = 0

  do {
    initial = JSON.stringify(schema.data)
    schema.data = derefSchema(schema.data, schema.refs)
    schema.data = extendSchema(schema.data, schema.refs)
    finish = JSON.stringify(schema.data)
    inc += 1
  } while (initial !== finish && inc < 10)

  if (inc === 10) {
    throw new Error('Extend/Reference structure has more than 10 levels or a circular reference was encountered.')
  }

  const ajv = new Ajv()
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
  let validate = ajv.compile(schema.data)

  if (validate.errors) {
    throw validate.errors
  }

  return schema.data
}