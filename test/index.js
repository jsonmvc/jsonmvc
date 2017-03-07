
require('promise-polyfill')

const jsonmvc = require('./../dist/node/jsonmvc.node.js')

let controllers = {
  incFoo: (stream, lib) => {
    return stream.delay(1000).map(x => x + 1)
      .map(x => ({
        op: 'add',
        path: '/foo',
        value: x
      }))
  },
  ajax: (stream, lib) => {
    return stream.map(x => lib.ajax({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      labels: ['google'],
      patch: true
    }))
  }
}

views = {
  theHeader: '<div></div>'
}


let models = {
  bam: barBaz => barBaz + 'bam'
}

let schema = {
  default: {
    foo: 123,
    bar: {
      baz: 'asd f'
    },
    items: [1, 2, 3],
    bam: {
      '1': 'bla',
      '2': 'bloo',
      '3': 'bing',
      '11': {
        '125': {
          'bar': 'NICE!!'
        }
      }
    }
  },
  validation: {
    foo: 'integer',
    bar: {
      baz: 'string'
    }
  },
  views: {
    theHeader: {
      title: '/baloo',
      foo: '/foo',
      time: '/time/hhmmss'
    },
    ajax: {
      request: '/ajax/data/<id>'
    },
    theContent: {
      title: '/foo',
      content: '/bam/<id>/<foo>/bar',
      pressedAt: '/ui/button/timestamp',
      ajaxContent: '/ajaxContent',
      ajaxRequestIds: '/ajax/ids',
      patched: '/patched'
    },
    theFooter: {
      title: '/foo',
      items: '/items'
    },
    blam: {
      count: '/foo'
    },
    bang: {
      title: '/bam/<id>'
    }
  },
  controllers: {
    incFoo: '/foo',
    ajax: '/baloo'
  },
  models: {
    '/baloo': {
      fn: 'bam',
      args: ['/bar/baz']
    }
  }
}

let config = {
  rootEl: '#app',
  rootComponent: 'theHeader'
}

  let instance = jsonmvc({
    config: config,
    controllers: controllers,
    models: models,
    views: views,
    schema: schema
  })

