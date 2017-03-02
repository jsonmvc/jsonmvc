
import { merge } from 'lodash'
import { EventEmitter } from 'events'

const jsonmvcDb = require('jsonmvc-db')
const Vue = require('vue')

const createControllers = require('./controllers/controllers')
const createViews = require('./views/views')
const createModels = require('./models/models')

const mountView = require('./lib/mountView')

const update = require('./lib/update')

const jsonmvc = o => {
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

  let db = jsonmvcDb(o.schema.default)

  if (window && typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
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

module.exports = jsonmvc
export default jsonmvc

