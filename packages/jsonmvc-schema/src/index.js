import resolveSchema from './fns/resolveSchema'

export default function loadSchema(file) {
  return resolveSchema(file)
  .then((schema) => {
    return {
      schema
    }
  })
}

// loadSchema(__dirname + '/../test/schema/app.yml')