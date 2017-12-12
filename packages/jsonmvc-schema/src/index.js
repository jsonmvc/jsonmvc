import deref from 'json-schema-ref-parser'

function loadSchema(file) {
  return deref.dereference(file)
  .then((schema) => {
    return {
      schema
    }
  })
}

export default loadSchema
module.exports = loadSchema

// loadSchema(__dirname + '/../test/schema/app.yml')