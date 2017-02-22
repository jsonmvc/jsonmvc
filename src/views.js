const Vue = require('vue/dist/vue.common.js')
const Emitter = require('events').EventEmitter
const most = require('most')
const shortid = require('shortid')
const PROP_REGEX = /<([a-z]+)>/g
const _ = require('lodash')

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%^')

function updateInstanceData(db, schema, props, data, self, prop, val) {

  // Unsubscribe all listeners for this prop
  props.schema.subscribes[prop].forEach(y => y())
  props.schema.subscribes[prop] = []

  // For all the paths that are impacted by this prop
  props.schema.tokens[prop].props.forEach(x => {
    let path = getPath(schema, props, self, x)

    let listener = createDataListener(db, path, data, x)

    props.schema.subscribes[prop].push(listener)
  })

}

function createDataListener(db, path, data, prop) {

  // @TODO: Remove when db.on returns also undefined values
  let v = db.get(path)
  if (undefined !== v) {
    // @TODO: Remove when db.get returns a copy of its caching
    // instead of the actual cache
    v = JSON.parse(JSON.stringify(v))
  }

  data[prop] = v

  // Listen on next values
  return db.on(path, v => {
    if (undefined !== v) {
      v = JSON.parse(JSON.stringify(v))
    }
    data[prop] = v
  })

}

function getPath(schema, props, instance, prop) {
  let path = schema[prop]
  let usedProps = props.schema.paths[path]

  // The path can have multiple props required
  usedProps.forEach(y => {
    path = path.replace(new RegExp(props.schema.tokens[y].token, 'g'), instance[y])
  })

  return path
}

function createView(db, name, html, schema, siblings) {

  let emitter = new Emitter()
  let stream = most.fromEvent('patch', emitter)
  let self

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


  // Watch for changes on the instance properties
  props.watchers = props.required.reduce((acc, x) => {

    acc[x] = function (val) {
      let self = this
      let props = self.__JSONMVC_PROPS
      let data = self.__JSONMVC_DATA
      let rootPath = self.__JSONMVC_ROOT
      updateInstanceData(db, schema, props, data, self, x, val)
      emitter.emit('patch', {
        op: 'add',
        path: `${rootPath}/props/${x}`,
        value: val
      })
    }

    return acc
  }, {})

  let component = Vue.component(name, {
    template: html,
    mounted: function () {
      let rootPath = this.__JSONMVC_ROOT

      emitter.emit('patch', {
        op: 'add',
        path: `${rootPath}/mounted`,
        value: true
      })

    },
    beforeCreate: function () {
      let self = this
      let id = shortid.generate()
      let rootPath = `/views/${name}/instances/${id}`

      self.__JSONMVC_ID = id
      self.__JSONMVC_PROPS = JSON.parse(JSON.stringify(props))
      self.__JSONMVC_ROOT = rootPath
      self.__JSONMVC_DATA = {}

      emitter.emit('patch', {
        op: 'add',
        path: rootPath,
        value: {}
      })
    },
    destroyed: function () {
      let rootPath = this.__JSONMVC_ROOT

      emitter.emit('patch', {
        op: 'add',
        path: `${rootPath}/destroyedAt`,
        value: new Date().getTime()
      })

    },
    data: function () {
      let self = this

      let props = self.__JSONMVC_PROPS
      let data = self.__JSONMVC_DATA

      Object.keys(schema).forEach(x => {
        let path = getPath(schema, props, self, x)

        let listener = createDataListener(db, path, data, x)


        props.schema.paths[schema[x]].forEach(y => {
          props.schema.subscribes[y].push(listener)
        })

        if (!props.subscribes[x]) {
          props.subscribes[x] = []
        }

        props.subscribes[x].push(listener)

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


function createViews(db, views, schema) {
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

    acc[x] = createView(db, x, views[x], schema[x], siblings)

    return acc
  }, {})

  // Apply patches on db
  Object.keys(instances).forEach(x => {

    let instance = instances[x]

    instance.unsubscribe = instance.stream.subscribe({
      next: x => {
        if (x && !_.isArray(x)) {
          x = [x]
        }
        db.patch(x)
      },
      complete: x => {
        console.log(`View ${name} stream has ended`)
      },
      error: x => {
        console.error(`View ${name} stream has an error`, x)
      }
    })

  })

  return instances
}

module.exports = createViews
