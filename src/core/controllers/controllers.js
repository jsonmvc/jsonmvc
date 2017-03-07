
import createController from 'controllers/create'

function createControllers(db, lib, schema, controllers) {
  let names = Object.keys(controllers)

  let instances = names.reduce((acc, x) => {
    acc[x] = createController(db, lib, controllers[x], schema[x])
    return acc
  }, {})

  return instances
}

module.exports = createControllers
