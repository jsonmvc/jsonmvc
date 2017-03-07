import { isArray } from 'lodash'

import createView from '_views/create'

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

    let usedStream = instance.stream.subscribe({
      next: x => {
        if (x && !isArray(x)) {
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

    instance.unsubscribe = function unsubscribeView() {
      usedStream.unsubscribe()
    }

  })

  return instances
}

module.exports = createViews
