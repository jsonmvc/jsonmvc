
import firebase from 'jsonmvc-module-firebase'
import ui from 'jsonmvc-module-ui'
import framework7 from 'jsonmvc-module-framework7'
import time from 'jsonmvc-module-time'
import forms from 'jsonmvc-module-forms'
import fields from 'jsonmvc-module-fields'
import ajax from 'jsonmvc-module-ajax'
import Promise from 'promise'

import lib from './../src/index'
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
        <p>{{ baz }}</p>
        <p>{{ qux }}</p>
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

  jest.runAllTimers()

  expect(instance.db.get('/baz')).toBe(123)
  expect(instance.db.get('/qux')).toBe('123qux')

  instance.db.patch([{
    op: 'add',
    path: '/bar',
    value: 'bar'
  }])

  jest.runAllTimers()
  expect(instance.db.get('/baz')).toBe('barbaz321')
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

  jest.runAllTimers()

  return new Promise((resolve, reject) => {
    instance.db.on('/time', x => {
      expect(x.hh).not.toBeFalsy()
      expect(instance.db.get('/module/test')).toBe('123baz')
      resolve()
    })
  })
})
