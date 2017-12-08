
const Ajv = require('ajv')
const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

function processData(data, result) {
  result = result || {}

  for (let i in data) {
    if (data[i].value && data[i].timestamp) {
      result[i] = data[i].value
    } else {
      result[i] = processData(result[i], result)
    }
  }

  return  result
}

module.exports = {
  args: {
    data: '<data>',
    submit: '<submit>',
    schema: '<schema>'
  },
  fn: args => {
    let result = {
      data: null,
      errors: null
    }

    if (!args.data || !args.schema || !args.submit) {
      return result
    }

    // @TODO: Validate data only after submit timestamp

    let data = processData(args.data)

    console.log(data)
    let isValid = ajv.validate(args.schema, data)

    if (isValid) {
      result.data = data
    } else {
      result.errors = ajv.errors
    }

    return result
  }
}