
import DB from 'jsonmvc-db'

import createControllers from '_controllers/controllers'
import createViews from '_views/views'
import createModels from '_models/models'
import mountView from '_fns/mountView'
import update from '_fns/update'
import mergeConfig from '_fns/mergeConfig'

import modules from '_module'
import lib from '_lib'

const jsonmvc = o => {

// @TODO: Simplify the declarations to match the new model

  o = mergeConfig(o, modules)

  let schema = o.schema
  let config = o.config
  /**
   * Ensure defaults
   */
  Object.keys(o.views).forEach(x => {
    if (!o.schema.views[x]) {
      o.schema.views[x] = {}
    }
  })

  let db = DB(o.schema.default)

  if (typeof window !== 'undefined') {
    window.db = db
  }

  let instances = {}

  /**
   * Models
   */
  instances.models = createModels(db, o.models, o.schema.models)

  /**
   * Views
   */
  instances.views = createViews(db, o.views, o.schema.views)

  mountView(o.config.rootEl, instances.views[o.config.rootComponent].component)

  /**
   * Controllers
   */
  instances.controllers = createControllers(db, o.schema.controllers, o.controllers)

  return {
    update: newO => {

      update(db, instances, o, newO)

    }
  }

}

if (typeof window !== 'undefined') {
  window.jsonmvc = jsonmvc
}

export default jsonmvc
