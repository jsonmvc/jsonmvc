
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
