
const merge = require('lodash/merge')
const propTypes = ['properties', 'patternProperties', 'allOf', 'oneOf', 'anyOf']

// TODO: Verifiy for circular references.
module.exports = function derefSchema(schema, refs) {

  if (schema.$ref) {
    schema = merge(schema, refs[schema.$ref])
    delete schema.$ref
  }

  if (schema.type === 'object') {
    propTypes.forEach(x => {
      if (schema[x]) {
        for (let i in schema[x]) {
          schema[x][i] = derefSchema(schema[x][i], refs)
        }
      }
    })
  } else if (schema.type === 'array' && schema.items) {
    if (schema.items.$ref) {
      schema.items = derefSchema(schema.items, refs)
    } else {
      propTypes.forEach(x => {
        if (schema.items[x]) {
          for (let i in schema.items[x]) {
            schema.items[x][i] = derefSchema(schema.items[x][i], refs)
          }
        }
      })
    }
  }

  return schema
}