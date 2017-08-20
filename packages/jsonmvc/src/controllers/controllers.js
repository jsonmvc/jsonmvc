
import forEach from 'lodash-es/forEach'
import createController from './create'

function createControllers (db, controllers) {
  forEach(controllers, (controller, name) => {
    createController(db, controller, name)
  })

  return controllers
}

export default createControllers
