
import omitBy from 'lodash-es/omitBy'
import merge from 'lodash-es/merge'
import forEach from 'lodash-es/forEach'
import reduce from 'lodash-es/reduce'

import DB from 'jsonmvc-db'
import guid from 'jsonmvc-helper-guid'

import createControllers from './controllers/controllers'
import createViews from './views/views'
import createModels from './models/models'
import update from './fns/update'
import bundleModules from './fns/bundleModules'
import start from './fns/start'

const jsonmvc = module => {

  module.controllers = module.controllers.reduce((acc, x) => {
    acc[guid()] = x
    return acc
  }, {})

  module.models = module.models.reduce((acc, x) => {
    acc[guid()] = x
    return acc
  }, {})

  module.views = module.views.reduce((acc, x) => {
    acc[guid()] = x
    return acc
  }, {})

  module.data = {
    initial: module.data
  }

  let modules = {
    app: module
  }

  let bundle = bundleModules(modules)

  let db = DB(bundle.data.initial)

  let instance = {
    db: db,
    controllers: createControllers(db, bundle.controllers),
    models: createModels(db, bundle.models),
    views: createViews(db, bundle.views)
  }

  if (typeof window !== 'undefined') {
    window.db = instance.db
    window.instance = instance
  }

  if (Object.keys(instance.views).length > 0) {
    setTimeout(() => {
      if (document.readyState === "complete") {
        start(instance)
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          start(instance)
        })
      }
    })
  } else {
    start(instance)
  }

  return {
    db,
    module,
    update: module => {
      update(instance, {
        app: module
      })
    }
  }
}

export default jsonmvc
