
import jsonmvc from 'jsonmvc'
import loadModule from 'jsonmvc-util-load'

let lib
if(__DEV__) {
  lib = require('./../src/index').default
} else {
  lib = require('./../dist/jsonmvc-util-update')
}

it('should update an instance', () => {
  let mod = loadModule({
    'models/bam.js': {
      path: '/bam',
      args: {
        baz: '/baz'
      },
      fn: args => (`${args.baz}bam`)
    },
    'data/initial.js': {
      baz: '321'
    }
  })

  mod.name = 'app'

  let instance = jsonmvc(mod)

  expect(instance.db.get('/bam')).toBe('321bam')

  let updatedModule = loadModule({
    'models/bam.js': {
      path: '/bam',
      args: {
        baz: '/baz'
      },
      fn: args => (`${args.baz}+updated`)
    }
  })

  updatedModule.name = 'app'

  lib(instance, updatedModule)

  expect(instance.db.get('/bam')).toBe('321+updated')
})

