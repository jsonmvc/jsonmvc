
import { forEach, merge } from 'lodash'
import bundleModules from '_fns/bundleModules'
import createControllers from '_controllers/controllers'
import subscribeController from '_controllers/subscribe'
import createModels from '_models/models'

function update(instance, modules) {

  let bundle = bundleModules(modules)
  console.log(instance, bundle)

  if (bundle.controllers) {
    forEach(bundle.controllers, (controller, name) => {
      let current = instance.controllers[name]
      if (current) {
        current.off()
        current.subscription.unsubscribe()
        delete instance.controllers[name]
      }
    })

    let newControllers = createControllers(instance.db, bundle.controllers)

    forEach(newControllers, (controller, name) => {
      instance.controllers[name] = controller
      controller.subscription = subscribeController(instance.db, controller)
    })

  }

  if (bundle.models) {
    forEach(bundle.models, (model, name) => {
      let current = instance.models[name]
      if (current) {
        current.remove()
        delete instance.models[name]
      }
    })

    let newModels = createModels(instance.db, bundle.models)

    forEach(newModels, (model, name) => {
      instance.models[name] = model
    })
  }

  return
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

    instances.views = createViews(db, o.views, o.schema.views)

    // Update logic

    mountView(o.config.rootEl, instances.views[o.config.rootComponent].component)
  }

  if (data.models) {


  }

}

module.exports = update
