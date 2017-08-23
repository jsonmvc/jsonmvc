
import firebase from 'jsonmvc-module-firebase'
import ui from 'jsonmvc-module-ui'
import framework7 from 'jsonmvc-module-framework7'
import time from 'jsonmvc-module-time'
import forms from 'jsonmvc-module-forms'
import fields from 'jsonmvc-module-fields'
import ajax from 'jsonmvc-module-ajax'
import Promise from 'promise'

let lib
if(__DEV__) {
  lib = require('./../src/index').default
} else {
  lib = require('./../dist/jsonmvc')
}

jest.useFakeTimers()

it('should create a basic app', () => {
  let app = {
    controllers: [],
    models: [],
    views: [],
    data: {}
  }

  app.controllers.push({
    args: {
      foo: '/bar'
    },
    fn: (args, lib) => ({
      op: 'add',
      path: '/baz',
      value: args.foo + 'baz' + lib.get('/faz')
    })
  })

  app.models.push({
    path: '/qux',
    args: {
      baz: '/baz'
    },
    fn: args => args.baz + 'qux'
  })

  app.views.push({
    name: 'app',
    args: {
      baz: '/baz',
      qux: '/qux'
    },
    template: `
      <div>
        <p class="baz">{{ baz }}</p>
        <p class="qux">{{ qux }}</p>
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
    baz: 123,
    faz: 321
  }

  let root = document.createElement('div')
  root.setAttribute('id', 'app')
  document.body.appendChild(root)

  let instance = lib(app)

  jest.runOnlyPendingTimers()

  expect(instance.db.get('/baz')).toBe(123)
  expect(instance.db.get('/qux')).toBe('123qux')

  instance.db.patch([{
    op: 'add',
    path: '/bar',
    value: 'bar'
  }])

  jest.runOnlyPendingTimers()

  expect(instance.db.get('/baz')).toBe('barbaz321')

  let baz = document.querySelector('.baz')
  let qux = document.querySelector('.qux')

  expect(baz).not.toBeNull()
  expect(qux).not.toBeNull()

  expect(baz.innerHTML).toBeTruthy()
  expect(qux.innerHTML).toBeTruthy()
})

it('should work with all modules', () => {
  let modules = [
    firebase,
    ui,
    time,
    fields,
    forms,
    ajax,
    framework7
  ]

  modules.push({
    name: 'app',
    models: [{
      path: '/module/test',
      args: {
        bam: '/bam'
      },
      fn: args => args.bam + 'baz'
    }],
    data: {
      bam: 123
    }
  })

  let instance = lib(modules)

  jest.runOnlyPendingTimers()

  return new Promise((resolve, reject) => {
    instance.db.on('/time', x => {
      expect(x.hh).not.toBeFalsy()
      expect(instance.db.get('/module/test')).toBe('123baz')
      resolve()
    })
  })
})

it('should update the instance with the new modules', () => {
  let app = {
    name: 'app',
    models: [{
      name: 'add-qux',
      path: '/qux',
      args: {
        baz: '/baz'
      },
      fn: args => args.baz + 'qux'
    }],
    data: {
      baz: 123
    }
  }

  let instance = lib(app)

  instance.update({
    name: 'app',
    models: [{
      name: 'add-qux',
      path: '/qux',
      args: {
        baz: '/baz'
      },
      fn: args => args.baz + 'bam'
    }, {
      path: '/bux',
      args: {
        qux: '/qux'
      },
      fn: args => args.qux + 'bux'
    }]
  })

  jest.runOnlyPendingTimers()

  expect(instance.db.get('/baz')).toBe(123)
  expect(instance.db.get('/qux')).toBe('123bam')
  expect(instance.db.get('/bux')).toBe('123bambux')
})
