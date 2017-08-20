
import forEach from 'lodash-es/forEach'
import isPlainObject from 'lodash-es/isPlainObject'
import bundleModules from './bundleModules'
import createControllers from './../controllers/controllers'
import subscribeController from './../controllers/subscribe'
import createModels from './../models/models'
import createViews from './../views/views'
import mountView from './mountView'

function update (instance, modules) {
  let bundle = bundleModules(modules)

  if (bundle.controllers && Object.keys(bundle.controllers).length > 0) {
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

  if (bundle.models && Object.keys(bundle.models).length > 0) {
    forEach(bundle.models, (model, name) => {
      let current = instance.models[name]
      if (current && current.remove) {
        current.remove()
        delete instance.models[name]
      }
    })

    let newModels = createModels(instance.db, bundle.models)

    forEach(newModels, (model, name) => {
      instance.models[name] = model
    })
  }

  if (bundle.data && Object.keys(bundle.data).length > 0) {
    if (bundle.data.initial) {
      console.log(bundle.data.initial)
      Object.keys(bundle.data.initial).forEach(x => {
        let val = bundle.data.initial[x]
        let op = isPlainObject(val) ? 'merge' : 'add'

        instance.db.patch([{
          op: op,
          path: '/' + x,
          value: val
        }])
      })
    }

    if (bundle.data.schema) {
      console.error('Schema HMR not implemented yet')
    }
  }

  if (bundle.views && Object.keys(bundle.views).length > 0) {
    forEach(instance.views, view => {
      view.unsubscribe()
    })

    let config = instance.db.get('/config/ui/mount')

    let root = instance.views[config.component]
    root.instance.$el.remove()

    instance.views = createViews(db, bundle.views)

    // Update logic
    mountView(config.el, instance.views[config.component].component)
  }
}

export default update
