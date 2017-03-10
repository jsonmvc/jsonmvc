
import { merge, forEach, reduce } from 'lodash'

import DB from 'jsonmvc-db'

import createControllers from '_controllers/controllers'
import createViews from '_views/views'
import createModels from '_models/models'
import mountView from '_fns/mountView'
import loadModule from '_fns/loadModule'
import update from '_fns/update'
import subscribe from '_controllers/subscribe'
import bundleModules from '_fns/bundleModules'

/**
 * Modules
 */
const jsonmvcModules = {
  ajax: loadModule(require.context('_modules/ajax', true, /\.yml|js/)),
  time: loadModule(require.context('_modules/time', true, /\.yml|js/)),
  ui: loadModule(require.context('_modules/ui', true, /\.yml|js/))
}

const jsonmvc = module => {

  let modules = merge(jsonmvcModules, {
    app: module
  })

  let bundle = bundleModules(modules)

  let db = DB(bundle.data.initial)

  let instance = {
    db: db,
    controllers: createControllers(db, bundle.controllers),
    models: createModels(db, bundle.models),
    views: createViews(db, bundle.views)
  }

  if (typeof window !== 'undefined') {
    window.db = instance.db
  }

  return {
    update: module => {
      update(instance, {
        app: module
      })
    },
    start: () => {
      let mount = instance.db.get('/config/ui/mount')
      mountView(mount.el, instance.views[mount.component].component)

      forEach(instance.controllers, (controller, name) => {
        controller.subscription = subscribe(instance.db, controller)
      })

    }
  }
}

if (typeof window !== 'undefined') {
  window.jsonmvc = jsonmvc
}

export {
  loadModule
}

export default jsonmvc
