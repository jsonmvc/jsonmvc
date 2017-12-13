import buildSchema from './fns/buildSchema'
import buildValidation from './fns/buildValidation'

const mod = {
  buildSchema,
  buildValidation
}

export {
  buildSchema,
  buildValidation
}

export default mod

module.exports = mod

// loadSchema(__dirname + '/../test/schema/app.yml')