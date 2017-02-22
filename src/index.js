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

  let def = 'theHeader'

  // Instantiate views
  let mainView = new Vue({
    el: '#app',
    render: h => h(instances.views[def].component)
  })

  /**
   * Controllers
   */
  instances.controllers = createControllers(o.controllers, o.schema.controllers)

  return {
    update: x => {
      console.log('updating')
    }
  }

}

module.exports = jsonmvc

// Load all html files
// Load the data.yml
// Use the default one (app.html) to start processing

// Load data.yml
// Assess which data corresponds to which element
// parse each path and uncover what props each
// component is waiting for

// Create Vue components for each element
// from app onwards

// Mount app.html
// And on mount for every component it encounters
// bind to the data stream

