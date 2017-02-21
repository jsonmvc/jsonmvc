const Vue = require('vue/dist/vue.common.js')
const Emitter = require('events').EventEmitter
const most = require('most')

const PROP_REGEX = /<([a-z]+)>/g


function getPaths() {

}

function createView(name, html, schema, siblings) {

  let emitter = new Emitter()
  let controller = 'THE CONTROLER'
  let stream = most.fromEvent('data', emitter)

  // Find what props are required based on the schema
  // e.g. /foo/<id>/bar - "id" will be a required prop
  // on the component
  // <bam id="123"></bam>
  //

  let requiredProps = Object.keys(schema).reduce((acc, x) => {
    schema[x].replace(PROP_REGEX, (a, b, c, d) => {
      if (acc.indexOf(b) === -1) {
        acc.push(b)
      }
    })
    return acc
  }, [])

  let self

  // A list of props and functions
  let watching = {}

  let component = Vue.component(name, {
    template: html,
    mounted: () => {
      emitter.emit('data', {
        op: 'add',
        path: `/views/${name}/instance`,
        value: 'bar'
      })
    },
    beforeDestroy: () => ({}),
    data: function () {
      self = this
      let data = {}

      Object.keys(schema).forEach(prop => {
        let path = schema[prop]

        path = path.replace(PROP_REGEX, (a, b, c, d) => {
          return self[b]
        })

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
    props: requiredProps
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
