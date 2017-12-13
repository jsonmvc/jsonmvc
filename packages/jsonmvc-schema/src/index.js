import buildSchema from './fns/buildSchema'
import addValidation from './fns/addValidation'

const mod = {
  buildSchema,
  addValidation
}

export {
  buildSchema,
  addValidation
}

export default mod

module.exports = mod

// loadSchema(__dirname + '/../test/schema/app.yml')