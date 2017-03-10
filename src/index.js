
import { merge, reduce } from 'lodash'

import DB from 'jsonmvc-db'

import createControllers from '_controllers/controllers'
import createViews from '_views/views'
import createModels from '_models/models'
import mountView from '_fns/mountView'
import loadModule from '_fns/loadModule'
import update from '_fns/update'
import subscribe from '_controllers/subscribe'

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

  let bundle = reduce(modules, (acc, v1, k1) => {
    reduce(v1, (acc2, v2, k2) => {
      if (k2 !== 'data') {
        v2 = reduce(v2, (acc3, v3, k3) => {
          acc3[k1 + '/' + k3] = v3
          return acc3
        }, {})
      }
      acc[k2] = merge(acc[k2], v2)
      return acc
    }, {})
    return acc
  }, {})

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
    update: newModules => {
      update(db, instances, modules, newModules)
    },
    init: () => {
      let mount = db.get('/config/ui/mount')
      mountView(mount.el, instance.views[mount.component].component)
      subscribe(instance.db, instance.controllers)
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
