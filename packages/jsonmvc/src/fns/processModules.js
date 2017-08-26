
import guid from 'jsonmvc-helper-guid'

function processModules(modules) {
  return modules.reduce((acc, mod) => {

    let components = [
      'controllers',
      'views',
      'models'
    ]

    if (!mod.name) {
      mod.name = 'app'
    }

    if (acc[mod.name]) {
      throw new Error(`Module name [${mod.name}] is already used. Please choose another module name.`)
    }

    components.forEach(x => {
      if (mod[x]) {
        mod[x] = mod[x].reduce((acc, y) => {
          let name = y.name || mod.name + '-' + guid()
          acc[name] = y
          return acc
        }, {})
      }
    })

    if (mod.data) {
      mod.data = {
        initial: mod.data
      }
    } else {
      mod.data = {
        initial: {}
      }
    }

    acc[mod.name] = mod

    return acc
  }, {})
}


export default processModules
