
import { omitBy, merge, forEach, reduce } from 'lodash'

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


const jsonmvc = (module, modulesList = {}) => {

  let enabledModules = {
    ajax: modulesList.ajax && loadModule(require.context('_modules/ajax', true, /\.yml|js/)),
    time: modulesList.time && loadModule(require.context('_modules/time', true, /\.yml|js/)),
    ui: modulesList.ui && loadModule(require.context('_modules/ui', true, /\.yml|js/)),
    forms: modulesList.forms && loadModule(require.context('_modules/forms', true, /\.yml|js/)),
    fields: modulesList.fields && loadModule(require.context('_modules/fields', true, /\.yml|js/)),
    firebase: modulesList.firebase && loadModule(require.context('_modules/firebase', true, /\.yml|js/)),
    framework7: modulesList.framework7 && loadModule(require.context('_modules/framework7', true, /\.yml|js/))
  }

  enabledModules = omitBy(enabledModules, x => x === undefined)

  let modules = merge(enabledModules, {
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
