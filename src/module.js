
const modulesContext = require.context('_modules/', true, /\.yaml|js/)
const moduleFile = /^\.\/([a-z0-9]+)\/([a-z]+)\/([a-z0-9]+)/gi
let modules = {}

modulesContext.keys().forEach(x => {
  let result = new RegExp(moduleFile).exec(x)

  if (result === null) {
    throw new Error(`${x} is not a valid module format`)
  }

  let name = result[1]
  let type = result[2]
  let fileName = result[3]

  if (!modules[name]) {
    modules[name] = {
      controllers: {},
      models: {},
      views: {},
      schema: {}
    }
  }

  if (!modules[name][type]) {
    return
  }

  modules[name][type][fileName] = modulesContext(x)
})

module.exports = modules
