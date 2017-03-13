
import jsonmvc, { loadModule } from './../../src/index'
import { difference } from 'lodash'

let context = require.context('./', true, /\.js|yml/)
let modules = loadModule(context)
let instance

document.addEventListener('DOMContentLoaded', function() {

  instance = jsonmvc(modules)

  instance.start()

  setTimeout(() => {
    instance.update({
      controllers: {
        incFoo: {
          args: '/foo',
          stream: stream => stream
            .delay(1000)
            .map(x => x + 2)
            .map(x => ({
              op: 'add',
              path: '/foo',
              value: x
            }))
        }
      }
    })
  }, 2 * 1000)

  setTimeout(() => {
    instance.update({
      models: {
        bam: {
          path: '/baloo',
          args: ['/bar/baz'],
          fn: x => x + ' bam - updated - should make another ajax request'
        }
      }
    })
  }, 1 * 1000)

  setTimeout(() => {
    instance.update({
      models: {
        bam: {
          path: '/baloo',
          args: ['/bar/baz'],
          fn: x => x + ' bam - updated third - should make another ajax request'
        }
      }
    })
  }, 2 * 1000)
  /*

  let i = 0
  setInterval(() => {
    instance.update({
      views: {
        theContent: `
          <div>
            <h2>The Updated ${i++} content {{ title }}</h2>
            {{ content }}
          </div>`
      }
    })
  }, 1000)

  setInterval(() => {
    instance.update({
      schema: {
        views: {
          theHeader: {
            title: '/bam/1'
          }
        }
      }
    })
  }, 2 * 1000)
  */

})

function stringify(obj) {
  return JSON.stringify(obj, function(key, val) {
    return (typeof val === 'function') ? val.toString() : val; },
  4)
}

if (module.hot) {
    module.hot.accept(context.id, () => {
      let context = require.context('./', true, /\.js|yml/)
      let newModules = loadModule(context)

      let changes = {
        controllers: {},
        models: {},
        views: {},
        data: {}
      }

      Object.keys(modules).forEach(x => {

        Object.keys(modules[x]).forEach(y => {
          if (!newModules[x][y]) {
            changes[x][y] = false
          } else if (stringify(newModules[x][y]) !== stringify(modules[x][y])) {
            changes[x][y] = newModules[x][y]
          }
        })

      })

      console.log('The changes are', changes)
      instance.update(changes)

    })

    module.hot.dispose(context.id, x => {
      console.log('Disposing', x)
    })
  } else {
    console.log('No HMR detected')
  }
