
import omitBy from 'lodash-es/omitBy'
import merge from 'lodash-es/merge'
import forEach from 'lodash-es/forEach'
import reduce from 'lodash-es/reduce'
import yeast from 'yeast'

import DB from 'jsonmvc-db'

import createControllers from './controllers/controllers'
import createViews from './views/views'
import createModels from './models/models'
import update from './fns/update'
import bundleModules from './fns/bundleModules'
import start from './fns/start'
import modulesList from './../modules/index'

const jsonmvc = module => {

  module.controllers = module.controllers.reduce((acc, x) => {
    acc[yeast()] = x
    return acc
  }, {})

  module.models = module.models.reduce((acc, x) => {
    acc[yeast()] = x
    return acc
  }, {})

  module.views = module.views.reduce((acc, x) => {
    acc[yeast()] = x
    return acc
  }, {})

  module.data = {
    initial: module.data
  }

  let modules = merge(modulesList, {
    app: module
  })

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


  setTimeout(() => {
    if (document.readyState === "complete") {
      start(instance)
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        start(instance)
      })
    }
  })

  return {
    module,
    update: module => {
      update(instance, {
        app: module
      })
    }
  }
}

export default jsonmvc
