
const createController = require('./create')


function createControllers(db, schema, controllers) {
  let names = Object.keys(controllers)

  let instances = names.reduce((acc, x) => {
    acc[x] = createController(db, controllers[x], schema[x])
    return acc
  }, {})

  return instances
}

module.exports = createControllers
