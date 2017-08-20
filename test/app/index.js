
import jsonmvc, { loadModule, reloadHMR } from './../../src/jsonmvc/index'

let context = require.context('./', true, /\.js|yml/)
let appModule = loadModule(context)
let instance = jsonmvc(appModule, {
  ajax: true,
  time: true,
  ui: true,
  forms: true,
  fields: true,
  firebase: true,
  framework7: true
})

window.app = instance

if (module.hot) {
  module.hot.accept(context.id, () => {
    let context = require.context('./', true, /\.js|yml/)
    reloadHMR(instance, context)
  })
}

db.on('/err', x => {
  console.error(x)
})
