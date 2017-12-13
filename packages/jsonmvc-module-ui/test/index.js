
import Promise from 'promise'
import jsonmvc from 'jsonmvc'

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
        <button v-for="(patch, id) in patches" :name="id" :value="id" :data-patch="patch" :id="id">Button</button>
      </div>
    `
  })

  let patches = {
    dbPath: [{
      op: 'add',
      path: '/foo/a',
      value: '/sample'
    }],
    text: [{
      op: 'add',
      path: '/foo1',
      value: '\'Sample text !@#$%^&*(+"\''
    }],
    number: [{
      op: 'add',
      path: '/foo2',
      value: -123.0981
    }],
    htmlAttribute: [{
      op: 'add',
      path: '/foo3',
      value: 'attr.name'
    }],
    htmlValueAttribute: [{
      op: 'add',
      path: '/foo4',
      value: 'attr.value'
    }],
    object: [{
      op: 'add',
      path: '/foo5',
      value: {
        foo: {
          bar: 123,
          baz: 'A !@#$%^&*(}{13'
        }
      }
    }],
    remove: [{
      op: 'remove',
      path: '/foo6'
    }],
    multiple: [{
      op: 'add',
      path: '/foo7',
      value: 123
    }, {
      op: 'add',
      path: '/bar7',
      value: {
        foo: {
          bar: 123,
          baz: 'A0!@#$%^&*()|}}'
        }
      }
    }, {
      op: 'remove',
      path: '/foo7'
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
    },
    sample: 123
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

// @TODO: Get prev value for comparison
        click(el)

        let removedPaths = []
        patch.reverse().forEach(y => {
          if (['add', 'replace'].indexOf(y.op) !== -1 && removedPaths.indexOf(y.path) === -1) {
            if (/^attr\./.test(y.value)) {
              expect(db.get(y.path)).toBe(x)
            } else if (y.value[0] === '/') {
              expect(db.get(y.path)).toBe(db.get(y.value))
            } else if (typeof y.value === 'string') {
              expect(db.get(y.path)).toEqual(y.value.replace(/^'/, '').replace(/'$/, ''))
            } else {
              expect(db.get(y.path)).toEqual(y.value)
            }
          } else if (y.op === 'remove') {
            expect(db.get(y.path)).toBeUndefined()
            removedPaths.push(y.path)
          }
        })
      })

      resolve()
    })

    jest.runOnlyPendingTimers()
  })

})
