import mountView from './mountView'
import forEach from 'lodash-es/forEach'
import subscribe from './../controllers/subscribe'

function start(instance) {

  if (Object.keys(instance.views).length > 0) {
    let mount = instance.db.get('/config/ui/mount')
    mountView(mount.root, instance.views[mount.view].component)
  }


  if (Object.keys(instance.controllers).length > 0) {
    forEach(instance.controllers, (controller, name) => {
      controller.subscription = subscribe(instance.db, controller)
    })
  }
}

export default start
