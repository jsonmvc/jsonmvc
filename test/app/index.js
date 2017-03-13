
import jsonmvc, { loadModule, reloadHMR } from './../../src/index'


let context = require.context('./', true, /\.js|yml/)
let appModule = loadModule(context)
let instance = jsonmvc(appModule)
instance.start()

if (module.hot) {
  module.hot.accept(context.id, () => {
    let context = require.context('./', true, /\.js|yml/)
    reloadHMR(instance, context)
  })
}
