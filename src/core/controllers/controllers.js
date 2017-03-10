
import { reduce, clone } from 'lodash'
import createController from '_controllers/create'

function createControllers(db, controllers) {

  return reduce(controllers, (acc, controller, name) => {

    acc[name] = createController(db, controller, name)

    return acc
  }, {})

}

module.exports = createControllers
