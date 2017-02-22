const Vue = require('vue/dist/vue.common.js')
const Emitter = require('events').EventEmitter
const most = require('most')
const shortid = require('shortid')
const PROP_REGEX = /<([a-z]+)>/g

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%^')


function getPaths() {

}

function updateInstanceData(db, schema, props, data, self, prop, val) {

  // Unsubscribe all listeners for this prop
  props.schema.subscribes[prop].forEach(y => y())
  props.schema.subscribes[prop] = []

  // For all the paths that are impacted by this prop
  props.schema.tokens[prop].props.forEach(x => {
    let path = schema[x]
    let usedProps = props.schema.paths[path]

    // The path can have multiple props required
    usedProps.forEach(y => {
      path = path.replace(new RegExp(props.schema.tokens[y].token, 'g'), self[y])
    })

    // @TODO: Remove when db.on returns also undefined values
    let v = db.get(path)
    if (undefined !== v) {
      // @TODO: Remove when db.get returns a copy of its caching
      // instead of the actual cache
      v = JSON.parse(JSON.stringify(v))
    }
    data[x] = v

    // Listen on next values
    props.schema.subscribes[prop].push(db.on(path, v => {
      if (undefined !== v) {
        v = JSON.parse(JSON.stringify(v))
      }
      data[x] = v
    }))

  })
}

function createView(name, html, schema, siblings) {

  let emitter = new Emitter()
  let controller = 'THE CONTROLER'
  let stream = most.fromEvent('patch', emitter)
  let data = {}
  let self
  let id = shortid.generate()

  let props = {

    // Find what props are required based on the schema
    // e.g. /foo/<id>/bar - "id" will be a required prop
    // on the component
    // <bam id="123"></bam>
    required: [],


    // Linking the required props with the data paths
    // from the schema
    schema: {},

    // On instance props that correlate with data paths
    // subscribes must be made and unsubscribed when
    // the the prop changes
    subscribes: {},

    // When instance props change the data function is not
    // called but watchers. DB.on listeners should be 
    // updated.
    watchers: {}
  }

  // Find all required props
  props.required = Object.keys(schema).reduce((acc, x) => {
    schema[x].replace(PROP_REGEX, (a, b, c, d) => {
      if (acc.indexOf(b) === -1) {
        acc.push(b)
      }
    })
    return acc
  }, [])

  // Map all props to all schema paths
  props.schema = Object.keys(schema).reduce((acc, x) => {
    let path = schema[x]

    if (!acc.paths[path]) {
      acc.paths[path] = []
    }

    path.replace(PROP_REGEX, (a, b, c, d) => {
      if (!acc.tokens[b]) {
        acc.tokens[b] = {
          token: a,
          props: []
        }
      }

      if (!acc.subscribes[b]) {
        acc.subscribes[b] = []
      }

      if (acc.tokens[b].props.indexOf(x) === -1) {
        acc.tokens[b].props.push(x)
      }

      if (acc.paths[path].indexOf(b) === -1) {
        acc.paths[path].push(b)
      }

    })

    return acc
  }, {
    paths: {},
    tokens: {},
    subscribes: {}
  })

  emitter.emit('patch', {
    op: 'add',
    path: `/views/${name}`,
    value: {
      instances: {}
    }
  })

  // Watch for changes on the instance properties
  props.watchers = props.required.reduce((acc, x) => {

    acc[x] = function (val) {
      updateInstanceData(db, schema, props, data, self, x, val)
      emitter.emit('patch', {
        op: 'add',
        path: `/views/${name}/instances/${id}/props/${x}`,
        value: val
      })
    }

    return acc
  }, {})

  let component = Vue.component(name, {
    template: html,
    mounted: () => {

      emitter.emit('patch', {
        op: 'add',
        path: `/views/${name}/instance`,
        value: 'bar'
      })

    },
    beforeDestroy: () => ({}),
    data: function () {
      self = this

      Object.keys(schema).forEach(x => {
        let path = schema[x]
        let usedProps = props.schema.paths[path]

        // The path can have multiple props required
        usedProps.forEach(y => {
          path = path.replace(new RegExp(props.schema.tokens[y].token, 'g'), self[y])
        })

        let v = db.get(path)
        if (undefined !== v) {
          v = JSON.parse(JSON.stringify(v))
        }

        data[x] = v

        db.on(path, v => {
          if (undefined !== v) {
            v = JSON.parse(JSON.stringify(v))
          }
          data[x] = v
        })

      })

      return data
    },
    watch: props.watchers,
    components: siblings,
    props: props.required
  })

  return {
    component,
    stream
  }
}


function createViews(views, schema) {
  let names = Object.keys(views)

  // Define deps
  let deps = names.reduce((acc, name) => {
    acc[name] = names.filter(x => {
      return new RegExp(`</${x}`).test(views[name])
    })
    return acc
  }, {})

  // Order names according to deps
  let ordered = []
  const orderDeps = x => {
    deps[x].forEach(orderDeps)
    if (ordered.indexOf(x) === -1) {
      ordered.push(x)
    }
  }
  names.forEach(orderDeps)

  // Create instances
  let instances = ordered.reduce((acc, x) => {

    let siblings = deps[x].reduce((acc2, y) => {
      acc2[y] = acc[y].component
      return acc2
    }, {})

    acc[x] = createView(x, views[x], schema[x], siblings)

    return acc
  }, {})

  return instances
}

module.exports = createViews
