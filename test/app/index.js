
import jsonmvc, { loadModule } from './../../src/index'

let module = loadModule(require.context('./', true, /\.js|yml/))

document.addEventListener('DOMContentLoaded', function() {

  let instance = jsonmvc(module)

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
    db.on('/baloo', x => {
      console.log('10 Updated', x)
    })
    console.log('Before', db.get('/baloo'))
    instance.update({
      models: {
        bam: {
          path: '/baloo',
          args: ['/bar/baz'],
          fn: x => x + ' bam - updated - should make another ajax request'
        }
      }
    })
    console.log('After', db.get('/baloo'))
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

