'use strict'

const jsonmvc = require('./../src/index.js')

let controllers = {
  incFoo: stream => {
    return stream
      .map(x => x.foo + 1)
  }
}

let views = {
  header: '<div>Header <h1>{{ title }}</h1></div>',
  content: '<div>Content <p>{{ nofoo }}</p></div>'
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
      title: '/bar/baz'
    },
    content: {
      nofoo: '/foo'
    }
  },
  controllers: {
    incFoo: {
      time: '/button/timestamp',
      foo: '/foo'
    }
  },
  models: {
    '/bam': {
      fn: 'bam',
      args: '/bar/baz'
    }
  }
}

let config = {}

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
