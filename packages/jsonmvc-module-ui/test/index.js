
import Promise from 'promise'
import jsonmvc from 'jsonmvc'
import $ from 'jquery'

import stringifyPatch from './../src/fns/stringifyPatch'

jest.useFakeTimers()

let mod
if(__DEV__) {
  mod = require('./../src/index').default
} else {
  mod = require('./../dist/jsonmvc-module-ui')
}

function click(el) {
  let event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })
  el.dispatchEvent(event)
}

it('should init properly', () => {
  let app = {
    controllers: [],
    models: [],
    views: [],
    data: {}
  }

  app.views.push({
    name: 'app',
    args: {
      patches: '/patches',
    },
    template: `
      <div>
        <button v-for="(patch, id) in patches" :data-patch="patch" :id="id">Button</button>
      </div>
    `
  })

  let patches = {
    single: [{
      op: 'add',
      path: '/boo',
      value: 123
    }],
    multiple: [{
      op: 'add',
      path: '/foo',
      value: 123
    }, {
      op: 'add',
      path: '/bam',
      value: 321
    }],
    remove: [{
      op: 'remove',
      path: '/bam'
    }]
  }

  app.data = {
    config: {
      ui: {
        mount: {
          root: '#app',
          view: 'app'
        }
      }
    }
  }

  app.data.patches = Object.keys(patches).reduce((acc, x) => {
    acc[x] = stringifyPatch(patches[x])
    return acc
  }, {})

  let root = document.createElement('div')
  root.setAttribute('id', 'app')
  document.body.appendChild(root)

  let modules = [
    mod,
    app
  ]

  let instance = jsonmvc(modules)

  jest.runOnlyPendingTimers()

  return new Promise((resolve, reject) => {

    setTimeout(() => {
      Object.keys(patches).forEach(x => {
        let patch = patches[x]
        let el = document.querySelector(`#${x}`)

        // Get prev value for comparison

        click(el)

        patch.forEach(y => {
          if (['add', 'replace'].indexOf(y.op) !== -1) {
            expect(db.get(y.path)).toBe(y.value)
          } else if (y.op === 'remove') {
            expect(db.get(y.path)).toBeUndefined()
          }
        })
      })

      resolve()
    })

    jest.runOnlyPendingTimers()
  })

})
