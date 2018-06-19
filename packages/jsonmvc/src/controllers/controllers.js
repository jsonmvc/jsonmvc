
import createController from './create'

function createControllers (db, controllers) {
  _.forEach(controllers, (controller, name) => {
    createController(db, controller, name)
  })

  return controllers
}

export default createControllers
