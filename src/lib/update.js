function update(db, instances, o, data) {

  if (data.schema) {

    o.schema = merge(o.schema, data.schema)

    if (data.schema.views) {
      data.views = o.views
    }

    if (data.schema.controllers) {

      data.controllers = {}
      Object.keys(data.schema.controllers).forEach(x => {
        data.controllers[x] = o.controllers[x]
      })

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

    let controllers = createControllers(db, o.schema.controllers, data.controllers)

    Object.keys(controllers).forEach(x => {
      instances.controllers[x] = controllers[x]
    })

  }

  if (data.views) {

    Object.keys(instances.views).forEach(x => {
      instances.views[x].unsubscribe()
    })

    let root = instances.views[o.config.rootComponent]
    root.instance.$destroy(true)
    root.instance.$el.remove()

    Object.keys(data.views).forEach(x => {
      if (o.views[x]) {
        delete instances.views[x]
      }
      if (o.views[x] !== null) {
        o.views[x] = data.views[x]
      }
    })

    Object.keys(o.views).forEach(x => {
      console.log(x, o.views[x])

    })

    instances.views = createViews(db, o.views, o.schema.views)

    // Update logic

    mountView(o.config.rootEl, instances.views[o.config.rootComponent].component)
  }

  if (data.models) {


  }

  console.log(Object.keys(instances.views).length)

}

module.exports = update
