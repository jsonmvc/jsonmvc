import resolveSchema from './fns/resolveSchema'

function loadSchema(file) {
  return resolveSchema(file)
  .then((schema) => {
    return {
      schema
    }
  })
}

export default loadSchema
module.exports = loadSchema

// loadSchema(__dirname + '/../test/schema/app.yml')