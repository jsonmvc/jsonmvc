
import { merge, forEach, reduce } from 'lodash'

import DB from 'jsonmvc-db'

import createControllers from '_controllers/controllers'
import createViews from '_views/views'
import createModels from '_models/models'
import loadModule from '_fns/loadModule'
import update from '_fns/update'
import bundleModules from '_fns/bundleModules'
import start from '_fns/start'
import reloadHMR from '_fns/reloadHMR'

/**
 * Modules
 */
const jsonmvcModules = {
  ajax: loadModule(require.context('_modules/ajax', true, /\.yml|js/)),
  time: loadModule(require.context('_modules/time', true, /\.yml|js/)),
  ui: loadModule(require.context('_modules/ui', true, /\.yml|js/)),
  form: loadModule(require.context('_modules/form', true, /\.yml|js/)),
  framework7: loadModule(require.context('_modules/framework7', true, /\.yml|js/))
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
    window.instance = instance
  }

  return {
    module,
    update: module => {
      update(instance, {
        app: module
      })
    },
    start: () => {

      if (document.readyState === "complete") {
        start(instance)
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          start(instance)
        })
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.jsonmvc = jsonmvc
}

export {
  loadModule,
  reloadHMR
}

export default jsonmvc
