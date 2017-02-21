'use strict'
const fs = require('fs')
const _ = require('lodash')
const most = require('most')
const jsonmvcDB = require('jsonmvc-db')
const Emitter = require('events').EventEmitter
const Vue = require('vue/dist/vue.common.js')

const PROP_REGEX = /<([a-z]+)>/g

const jsonmvc = o => {
  let controllers = o.controllers
  let models = o.models
  let views = o.views
  let schema = o.schema
  let config = o.config

  let data = schema.default
  let db = jsonmvcDB(data)

  window.db = db

  let instances = {
    controllers: {},
    models: {},
    views: {}
  }


  /**
   * Models
   */

  /**
   * Views
   */

  // Make views use the same controller logic.
  // Basically there are user defined controllers
  // and system controllers
  ;(function () {
    let names = Object.keys(views)

    // Create instances
    names.forEach(name => {
      let html = views[name]
      let viewSchema = schema.views[name] ? schema.views[name] : {}
      let deps = names.filter(name => {
        return new RegExp(`</${name}`).test(html)
      })

      let controller = 'THE CONTROLER'

      // Get required props on view
      let props = Object.keys(viewSchema).reduce((acc, name) => {

        viewSchema[name].replace(PROP_REGEX, (a, b, c, d) => {
          if (acc.indexOf(b) === -1) {
            acc.push(b)
          }
        })

        return acc
      }, [])

      instances.views[name] = {
        name,
        html,
        deps,
        schema: viewSchema,
        props,
        controller: controller
      }
    })

    // Order names according to deps
    let ordered = []
    const orderDeps = name => {
      instances.views[name].deps.forEach(orderDeps)
      if (ordered.indexOf(name) === -1) {
        ordered.push(name)
      }
    }

    names.forEach(orderDeps)

    // Create components
    ordered.forEach(name => {
      let instance = instances.views[name]
      let schema = instance.schema
      let self

      // A list of props and functions
      let watching = {}

      // Siblings
      let siblings = instance.deps.reduce((acc, x) => {
        acc[x] = instances.views[x].component
        return acc
      }, {})

      let component = Vue.component(name, {
        template: instance.html,
        mounted: () => ({}),
        beforeDestroy: () => ({}),
        data: () => {
          self = this
          let data = {}

          Object.keys(schema).forEach(prop => {
            let path = schema[prop]
            data[prop] = db.get(path)

            db.on(path, x => {
              if (undefined !== x) {
                x = JSON.parse(JSON.stringify(x))
              }
              data[prop] = x
            })
          })

          return data
        },
        watch: watching,
        components: siblings,
        props: instance.props
      })

      instance.component = component
    })

    let def = 'bar'

    // Instantiate views
    let mainView = new Vue({
      el: '#app',
      render: h => h(instances.views[def].component)
    })

  }())

  /**
   * Controllers
   */
  ;(function () {
    Object.keys(controllers).forEach(name => {
      let controller = controllers[name]
      let emitter = new Emitter()
      let path = schema.controllers[name]
      let inStream = most.fromEvent('data', emitter)

      db.on(path, x => {
        emitter.emit('data', x)
      })

      let outStream = controller(inStream)

      instances.controllers[name] = outStream.subscribe({
        next: x => {
          if (x && !_.isArray(x)) {
            x = [x]
          }
          db.patch(x)
        },
        complete: x => {
          console.log(`Controller ${name} has ended`)
        },
        error: x => {
          console.error(`Controller ${name} has an error`, x)
        }
      })

    })
  }())
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

