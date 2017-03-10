
import { merge, reduce } from 'lodash'


import DB from 'jsonmvc-db'

import createControllers from '_controllers/controllers'
import createViews from '_views/views'
import createModels from '_models/models'
import mountView from '_fns/mountView'
import loadModule from '_fns/loadModule'
import update from '_fns/update'

/**
 * Modules
 */
const jsonmvcModules = {
  ajax: loadModule(require.context('_modules/ajax', true, /\.yml|js/)),
  time: loadModule(require.context('_modules/time', true, /\.yml|js/)),
  ui: loadModule(require.context('_modules/ui', true, /\.yml|js/))
}

/**
 * Libs
 */
const libContext = require.context('_libs/', true, /\.js/)
const libs = libContext.keys().reduce((acc, x) => {
  let name = new RegExp(/^\.\/([a-z0-9]+)/gi).exec(x)[1]
  acc[name] = libContext(x)
  return acc
}, {})

const lib = (namespace, db) => {
  return reduce(libs,(acc, x) => {
    acc[x] = libs[x](namespace, db)
    return acc
  }, {})
}

const jsonmvc = module => {

  let modules = merge(jsonmvcModules, {
    app: module
  })

  let bundle = reduce(modules, (acc, v1, k1) => {
    reduce(v1, (acc2, v2, k2) => {
      acc[k2] = merge(acc[k2], v2)
      return acc
    }, {})
    return acc
  }, {})

  console.log(bundle)

    /*
  let db = DB(initial)

  if (typeof window !== 'undefined') {
    window.db = db
  }

  let instances = {}
  instances.models = createModels(db, modules.models)

  /*
  instances.views = createViews(db, o.views, o.schema.views)
  instances.controllers = createControllers(db, lib, o.schema.controllers, o.controllers)
  mountView(o.config.rootEl, instances.views[o.config.rootComponent].component)
  */

  return {
    update: newModules => {
      update(db, instances, modules, newModules)
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
