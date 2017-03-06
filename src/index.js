
import { merge } from 'lodash'
import DB from 'jsonmvc-db'
import Vue from 'vue'
import createControllers from 'controllers/controllers'
import createViews from 'views/views'
import createModels from 'models/models'
import mountView from 'lib/mountView'
import update from 'lib/update'

const modulesContext = require.context('modules/', true, /\.yaml|js/)
let modules = {}
let moduleFile = /^\.\/([a-z0-9]+)\/([a-z]+)\/([a-z0-9]+)/gi
let moduleEntry = /^\.\/([a-z0-9]+)\/index\.js$/gi

let modulesApi = {}

modulesContext.keys().forEach(x => {
  let result = new RegExp(moduleFile).exec(x)
  let entry = new RegExp(moduleEntry).exec(x)

  if (entry !== null) {
    modulesApi[entry[1]] = modulesContext(x)
    return

  }

  if (result === null) {
    throw new Error(`${x} is not a valid module format`)
  }

  let name = result[1]
  let type = result[2]
  let fileName = result[3]

  if (!modules[name]) {
    modules[name] = {
      controllers: {},
      models: {},
      views: {},
      schema: {}
    }
  }

  if (!modules[name][type]) {
    return
  }

  modules[name][type][fileName] = modulesContext(x)
})

const lib = db => {
  return Object.keys(modulesApi).reduce((acc, x) => {
    acc[x] = modulesApi[x](db)
    return acc
  }, {})
}

const jsonmvc = o => {

// @TODO: Simplify the declarations to match the new model


// @TODO: These should not overwrite user defined data
// or at least inform the user that he is trying to overwrite
// a module
  Object.keys(modules).forEach(x => {
    let module = modules[x]

    Object.keys(module.controllers).forEach(y => {
      let c = module.controllers[y]
      o.controllers[x + y] = c.stream
      o.schema.controllers[x + y] = c.args[0]
    })

    Object.keys(module.models).forEach(y => {
      let m = module.models[y]
      o.models[x + y] = m.fn
      o.schema.models[m.path] = {
        fn: x + y,
        args: m.args
      }
    })

    o.schema.default = merge(o.schema.default, module.schema.default)
  })

  console.log(o, modules)

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
  instances.controllers = createControllers(db, lib, o.schema.controllers, o.controllers)

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
