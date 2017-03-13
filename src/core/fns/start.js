import mountView from '_fns/mountView'
import { forEach } from 'lodash'
import subscribe from '_controllers/subscribe'

function start(instance) {
  let mount = instance.db.get('/config/ui/mount')
  mountView(mount.el, instance.views[mount.component].component)

  forEach(instance.controllers, (controller, name) => {
    controller.subscription = subscribe(instance.db, controller)
  })
}

module.exports = start
