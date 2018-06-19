import mountView from './mountView'
import subscribe from './../controllers/subscribe'

function start (instance) {
  if (instance.views && Object.keys(instance.views).length > 0) {
    let mount = instance.db.get('/config/ui/mount')
    if (mount && mount.root) {
      mountView(mount.root, instance.views[mount.view].component)
    }
  }

  if (instance.controllers && Object.keys(instance.controllers).length > 0) {
    _.forEach(instance.controllers, (controller, name) => {
      controller.subscription = subscribe(instance.db, controller)
    })
  }
}

export default start
