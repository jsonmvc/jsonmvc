
let jsonmvc
let loadModule
let lib

if(__DEV__) {
  lib = require('./../src/index').default
  jsonmvc = require('./../../jsonmvc/src/index.js').default
  loadModule = require('./../../jsonmvc-util-load/src/index.js').default
} else {
  lib = require('./../dist/jsonmvc-util-changes')
  jsonmvc = require('jsonmvc')
  loadModule = require('jsonmvc-util-load')
}

jest.useFakeTimers()

it('should get the correct changes', () => {
  let mod = loadModule({
    name: 'app',
    files: {
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

  let newModule = {
    'controllers/baz.js': {
      args: {
        baz: '/baz'
      },
      fn: args => ([])
    },
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
      template: '<div id="thebam">{{ bam }}123</div>'
    }
  }

  let updatedModule = loadModule({
    name: 'app',
    files: newModule
  })

  let tempName = updatedModule.views[0].name
  delete updatedModule.views[0].name
  expect(() => {
    lib(instance, updatedModule)
  }).toThrow()

  updatedModule.views[0].name = tempName

  let changes = lib(instance, updatedModule)

  expect(changes.models).toHaveLength(2)
  // expect(changes.data).toMatchObject(newModule['data/initial.js'])
  expect(changes.views).toHaveLength(1)
  expect(changes.controllers).toHaveLength(0)
})

it('should throw an error when updating an unnamed component', () => {

})

