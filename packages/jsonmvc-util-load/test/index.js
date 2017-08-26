
let jsonmvc

let lib
if(__DEV__) {
  lib = require('./../src/index').default
  jsonmvc = require('./../../jsonmvc/src/index').default
} else {
  lib = require('./../dist/jsonmvc-util-load')
  jsonmvc = require('jsonmvc')
}

jest.useFakeTimers()

it('should loadModule', () => {
  let mod = lib({
    name: 'app',
    files: {
      'controllers/baz.js': {
        args: {
          baz: '/baz'
        },
        fn: args => ([])
      },
      'views/bam.js': {
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
})
