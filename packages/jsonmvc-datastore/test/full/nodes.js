'use strict'

jest.useFakeTimers()

const dbFn = require(`${__dirname}/../../dist/jsonmvc-datastore`)

it('Should test complex node scenarios', () => {
  let doc = {
    foo: {
      bar: {
        baz: 123
      }
    }
  }

  let db = dbFn(doc)

  db.node('/bam', ['/foo/bar/baz'], x => {
    return x + 10
  })

  db.on('/bam', x => {
    // console.log(x)
  })

  db.patch([{
    op: 'add',
    path: '/foo/bar/baz',
    value: 125
  }])

  setTimeout(() => {
    db.patch([{
      op: 'merge',
      path: '/foo/bar',
      value: {
        baz: 128
      }
    }])
  })

  return new Promise((resolve) => {

    setTimeout(() => {
      resolve()
    }, 2000)

    jest.runAllTimers()
  })

})
