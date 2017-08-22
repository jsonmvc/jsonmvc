
import jsonmvc from 'jsonmvc'

let lib
if(__DEV__) {
  lib = require('./../src/index').default
} else {
  lib = require('./../dist/jsonmvc-util-load')
}

it('should loadModule', () => {
  let mod = lib({
    'models/bam.js': {
      path: '/bam',
      args: {
        baz: '/baz'
      },
      fn: args => args.baz + '123'
    },
    'data/initial.js': {
      baz: '321'
    }
  })

  let instance = jsonmvc(mod)

  expect(instance.db.get('/bam')).toBe('321123')
})
