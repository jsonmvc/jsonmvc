
import jsonmvc, { loadModule, reloadHMR } from './../../src/index'


let context = require.context('./', true, /\.js|yml/)
let appModule = loadModule(context)
let instance = jsonmvc(appModule, [
  'ajax',
  'time',
  'ui',
  'forms',
  'fields',
  'firebase',
  'framework7'
  ])

instance.start()

if (module.hot) {
  module.hot.accept(context.id, () => {
    let context = require.context('./', true, /\.js|yml/)
    reloadHMR(instance, context)
  })
}

/*

instance.db.on('/err', x => {
  console.error(x)
})
*/
