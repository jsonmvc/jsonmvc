import { isArray, reduce, clone } from 'lodash'

import createView from '_views/create'
import viewsErrors from '_views/viewsErrors'

function createViews(db, views) {

  let err = viewsErrors(views)
  if (err instanceof Error) {
    throw err
  }

  let byNames = reduce(views, (acc, view, file) => {
    acc[view.name] = clone(view)
    acc[view.name].file = file
    return acc
  }, {})

  let names = Object.keys(byNames)

  // Add default mounting flag for views
  let mountingFlags = names.reduce((acc, x) => {
    acc[x] = true
    return acc
  }, {})

  db.patch([{
    op: 'add',
    path: '/shouldMount',
    value: mountingFlags
  }])

  // Define deps
  let deps = reduce(names, (acc, name) => {
    acc[name] = names.filter(x => {
      return new RegExp(`</${x}>`).test(byNames[name].el)
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

    acc[x] = createView(db, byNames[x], siblings)

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
      if (instance.instance) {
        instance.instance.$destroy()
      }
      // @TODO: Unsubscribe only when the destroyAt was set on the instance db
      usedStream.unsubscribe()
    }

  })

  return instances
}

module.exports = createViews
