
import guid from 'jsonmvc-helper-guid'

function processModules(modules) {
  return modules.reduce((acc, mod) => {

    if (mod.controllers) {
      mod.controllers = mod.controllers.reduce((acc, x) => {
        let name = x.name || guid()
        acc[name] = x
        return acc
      }, {})
    }

    if (mod.models) {
      mod.models = mod.models.reduce((acc, x) => {
        let name = x.name || guid()
        acc[name] = x
        return acc
      }, {})
    }

    if (mod.views) {
      mod.views = mod.views.reduce((acc, x) => {
        let name = x.name || guid()
        acc[name] = x
        return acc
      }, {})
    }

    if (mod.data) {
      mod.data = {
        initial: mod.data
      }
    } else {
      mod.data = {
        initial: {}
      }
    }

    if (!mod.name) {
      mod.name = 'app'
    }

    if (acc[mod.name]) {
      throw new Error(`Module name [${mod.name}] is already used. Please choose another module name.`)
    }

    acc[mod.name] = mod

    return acc
  }, {})
}


export default processModules
