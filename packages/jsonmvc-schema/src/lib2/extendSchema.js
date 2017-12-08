
const inputExtension = require('./inputExtension')
const extendSchema = require('./extendSchema')
const merge = require('lodash/merge')

const propTypes = ['properties', 'patternProperties', 'allOf', 'oneOf', 'anyOf']
const extensions = {
  dataEntry: (data, dataPath, schemaPath) => {
    let ext = {
      type: 'object',
      required: ['input', 'output', 'submit'],
      properties: {
        input: inputExtension(data),
        submit: {
          $ref: 'types.value'
        },
        output: {
          $model: 'validation',
          props: {
            data: dataPath + '/input',
            schema: schemaPath,
            submit: dataPath + '/submit'
          }
        }
      }
    }

    return ext
  }
}

module.exports = function extendSchema(schema, refs, dataPath, schemaPath) {
  dataPath = dataPath || ''
  schemaPath = schemaPath || '/schema'

  if (schema.$extend) {
    let extended = extensions[schema.$extend.type](refs[schema.$extend.data], dataPath, schemaPath)
    schema = merge(schema, extended)
    delete schema.$extend
  }

  if (schema.type === 'object') {
    propTypes.forEach(x => {
      if (schema[x]) {
        schemaPath += '/' + x
        for (let i in schema[x]) {
          schema[x][i] = extendSchema(schema[x][i], refs, dataPath + '/' + i, schemaPath + '/' + i)
        }
      }
    })
  }

  return schema
}