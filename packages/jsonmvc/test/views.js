import Promise from 'promise'

let lib
let firebase
let ui
let framework7
let time
let forms
let fields
let ajax

if(__DEV__) {
  lib = require('./../src/index').default
  firebase = require('./../../jsonmvc-module-firebase/src/index.js').default
  ui = require('./../../jsonmvc-module-ui/src/index.js').default
  framework7 = require('./../../jsonmvc-module-framework7/src/index.js').default
  time = require('./../../jsonmvc-module-time/src/index.js').default
  forms = require('./../../jsonmvc-module-forms/src/index.js').default
  fields = require('./../../jsonmvc-module-fields/src/index.js').default
  ajax = require('./../../jsonmvc-module-ajax/src/index.js').default
} else {
  lib = require('./../dist/jsonmvc')
  firebase = require('jsonmvc-module-firebase')
  ui = require('jsonmvc-module-ui')
  framework7 = require('jsonmvc-module-framework7')
  time = require('jsonmvc-module-time')
  forms = require('jsonmvc-module-forms')
  fields = require('jsonmvc-module-fields')
  ajax = require('jsonmvc-module-ajax')
}

jest.useFakeTimers()

it('it should allow recursive args paths', () => {
  let app = {
    controllers: [],
    models: [],
    views: [],
    data: {}
  }

  app.views.push({
    name: 'app',
    args: {
      bam: '<baz>',
      baz: '/baz/path'
    },
    template: `
      <div>
        <p class="baz">{{ baz }}</p>
        <p class="bam">{{ bam }}</p>
      </div>
    `
  })

  app.data = {
    config: {
      ui: {
        mount: {
          root: '#app',
          view: 'app'
        }
      }
    },
    baz: {
      path: '/foo'
    },
    foo: 123
  }

  let root = document.createElement('div')
  root.setAttribute('id', 'app')
  document.body.appendChild(root)

  let instance = lib(app)

  jest.runOnlyPendingTimers()

  let bam = document.querySelector('.bam')
  let baz = document.querySelector('.baz')
  expect(instance.db.get('/foo') + '').toBe(bam.innerHTML)

})