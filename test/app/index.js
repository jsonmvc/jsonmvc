
import jsonmvc, { loadModule } from './../../src/index'

let module = loadModule(require.context('./', true, /\.js|yml/))

document.addEventListener('DOMContentLoaded', function() {

  let instance = jsonmvc(module)
  instance.init()

  /*
  setTimeout(() => {
    instance.update({
      controllers: {
        incFoo: stream => {
          return stream.delay(1000).map(x => x + 10)
            .map(x => ({
              op: 'add',
              path: '/foo',
              value: x
            }))
          }
      }
    })
  }, 2 * 1000)


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

