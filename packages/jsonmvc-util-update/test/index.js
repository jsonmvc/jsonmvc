
let jsonmvc
let loadModule
let lib

if(__DEV__) {
  lib = require('./../src/index').default
  jsonmvc = require('./../../jsonmvc/src/index.js').default
  loadModule = require('./../../jsonmvc-util-load/src/index.js').default
} else {
  lib = require('./../dist/jsonmvc-util-update')
  jsonmvc = require('jsonmvc')
  loadModule = require('jsonmvc-util-load')
}

jest.useFakeTimers()

it('should update an instance', () => {
  let mod = loadModule({
    'controllers/baz.js': {
      args: {
        baz: '/baz'
      },
      fn: args => ([])
    },
    'views/bam.js': {
      name: 'bam',
      args: {
        bam: '/bam'
      },
      template: `<div id="thebam">{{ bam }}</div>`
    },
    'models/bam.js': {
      path: '/bam',
      args: {
        baz: '/baz'
      },
      fn: args => args.baz + '123'
    },
    'data/initial.js': {
      config: {
        ui: {
          mount: {
            root: '#app',
            view: 'bam'
          }
        }
      },
      baz: '321'
    }
  })

  let root = document.createElement('div')
  root.setAttribute('id', 'app')
  document.body.appendChild(root)

  let instance = jsonmvc(mod)

  jest.runOnlyPendingTimers()

  let el = document.querySelector('#thebam')

  expect(instance.db.get('/bam')).toBe('321123')
  expect(el).not.toBeNull()
  expect(el.innerHTML).toBe('321123')

  let updatedModule = loadModule({
    'models/qux.js': {
      path: '/qux',
      args: {
        bam: '/bam'
      },
      fn: args => (`${args.bam}+qux`)
    },
    'models/bam.js': {
      path: '/bam',
      args: {
        baz: '/baz'
      },
      fn: args => (`${args.baz}+updated`)
    },
    'data/initial.js': {
      config: {
        ui: {
          mount: {
            root: '#app',
            view: 'bam'
          }
        }
      },
      baz: '555'
    },
    'views/bam.js': {
      args: {
        bam: '/qux'
      },
      template: '<div id="thebam">{{ bam }}</div>'
    }
  })

  lib(instance, updatedModule)

  jest.runOnlyPendingTimers()

  el = document.querySelector('#thebam')

  expect(instance.db.get('/bam')).toBe('555+updated')
  expect(el).not.toBeNull()
  expect(el.innerHTML).toBe('555+updated+qux')

})

