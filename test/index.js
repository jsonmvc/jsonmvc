'use strict'

const jsonmvc = require('./../src/index.js')
/*

let controllers = {
  incFoo: stream => {
    return stream
      .map(x => x + 1)
  },
  err: stream => {
    return stream
      .filter(x => x.length > 0)
      .map(x => {
        console.log('Triggered an error', JSON.stringify(x, null, ' '))
        return {
          op: 'add',
          path: '/bar',
          value: 123
        }
      })
  }
}
*/

let controllers = {}

let views = {
  header: '<div>Header <h1>{{ title }}</h1></div>',
  content: '<footer></footer><div>Content <p>{{ nofoo }}</p></div>',
  footer: '<header></header><div>Footer</div>'
}

let models = {
  bam: barBaz => barBaz + 'bam'
}

let schema = {
  default: {
    foo: 123,
    bar: {
      baz: 'asdf'
    }
  },
  data: {
    foo: 'integer',
    bar: {
      baz: 'string'
    }
  },
  views: {
    header: {
      title: '/bar/<id>/<title>/<id>/baz',
      content: '/bam/<id>/<foo>/bar'
    },
    content: {
      nofoo: '/foo'
    }
  },
  controllers: {
    incFoo: '/foo',
    err: '/err/patch'
  },
  models: {
    '/bam': {
      fn: 'bam',
      args: '/bar/baz'
    }
  }
}

let config = {
  rootElement: '#app'
}

let instance = jsonmvc({
  config: config,
  controllers: controllers,
  models: models,
  views: views,
  schema: schema
})

/*
instance.update({
  controllers: {

  }
})
*/
