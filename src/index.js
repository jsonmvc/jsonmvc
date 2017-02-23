'use strict'
const fs = require('fs')
const _ = require('lodash')
const most = require('most')
const jsonmvcDB = require('jsonmvc-db')
const Emitter = require('events').EventEmitter
const Vue = require('vue/dist/vue.common.js')

const createControllers = require('./controllers')
const createViews = require('./views')
const createModels = require('./models')


function mountView(el, component) {
  let root = document.querySelector(el)
  let container = document.createElement('div')
  root.append(container)

  let view = new Vue({
    el: `${el} > div`,
    render: h => h(component)
  })

  return view
}

function update(instances, o, data) {
  let refresh = {
    controllers: data.controllers !== undefined,
    views: data.views !== undefined
  }

  if (data.schema) {

    o.schema = _.merge(o.schema, data.schema)

    if (data.schema.views) {
      refresh.views = true
    }

    if (data.schema.controllers) {
      refresh.controllers = true
    }

  }

  if (data.controllers) {

    // Unsubscribe controllers
    Object.keys(data.controllers).forEach(x => {
      if (instances.controllers[x]) {
        instances.controllers[x]()
        delete instances.controllers[x]
      }
    })

    let controllers = createControllers(o.schema.controllers, data.controllers)

    Object.keys(controllers).forEach(x => {
      instances.controllers[x] = controllers[x]
    })

  }

  if (data.views) {

    Object.keys(instances.views).forEach(x => {
      instances.views[x].unsubscribe()
    })

    let root = instances.views[o.schema.config.rootComponent]
    root.instance.$destroy()
    root.instance.$el.remove()

    Object.keys(data.views).forEach(x => {
      if (o.views[x]) {
        delete instances.views[x]
      }
      if (o.views[x] !== null) {
        o.views[x] = data.views[x]
      }
    })

    instances.views = createViews(db, o.views, o.schema.views)

    // Update logic

    mountView(o.schema.config.rootEl, instances.views[o.schema.config.rootComponent].component)
  }

}

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

  let db = jsonmvcDB(o.schema.default)

  window.db = db

  let instances = {}

  /**
   * Models
   */
  instances.models = createModels(o.models)

  /**
   * Views
   */
  instances.views = createViews(db, o.views, o.schema.views)

  mountView(o.schema.config.rootEl, instances.views[o.schema.config.rootComponent].component)

  /**
   * Controllers
   */
  instances.controllers = createControllers(o.schema.controllers, o.controllers)

  return {
    update: newO => {

      update(instances, o, newO)

    }
  }

}

module.exports = jsonmvc
