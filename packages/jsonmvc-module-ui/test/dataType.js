
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


it('should test data-type attribute', () => {
  let app = {
    controllers: [],
    models: [],
    views: [],
    data: {}
  }

  app.views.push({
    name: 'app',
    args: {
      attributes: '/attributes',
    },
    template: `
      <div>
        <button v-for="(attr, id) in attributes" :name="id" :value="attr.value" :data-patch="attr.patch" :data-type="attr.dataType" :id="id">Button</button>
      </div>
    `
  })

  let attributes = {
    numberToNumber: {
      dataType: 'number',
      value: 123,
      expected: 123,
      patch: {
        op: 'add',
        path:  '/attr/numberToNumber/value',
        value: 'attr.value'
      }
    },
    numberToString: {
      dataType: 'string',
      value: 123,
      expected: '123',
      patch: {
        op: 'add',
        path:  '/attr/numberToString/value',
        value: 'attr.value'
      }
    },
    stringToNumber: {
      dataType: 'number',
      value: '123',
      expected: 123,
      patch: {
        op: 'add',
        path:  '/attr/stringToNumber/value',
        value: 'attr.value'
      }
    },
    stringToString: {
      dataType: 'string',
      value: '123',
      expected: '123',
      patch: {
        op: 'add',
        path:  '/attr/stringToString/value',
        value: 'attr.value'
      }
    }
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
    attributes
  }

  app.data.attributes = Object.keys(app.data.attributes).reduce((acc, x) => {
    acc[x] = JSON.parse(JSON.stringify(app.data.attributes[x]))
    acc[x].patch = stringifyPatch([acc[x].patch])
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
      Object.keys(attributes).forEach(x => {
        let attr = attributes[x]
        let el = document.querySelector(`#${x}`)

// @TODO: Get prev value for comparison
        click(el)

        let val = db.get(attr.patch.path)

        expect(val).toBe(attr.expected)
      })

      resolve()
    })

    jest.runOnlyPendingTimers()
  })

})
