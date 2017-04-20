
module.exports = {
  args: {
    baz: '/bar/baz'
  },
  fn: (stream, lib) => stream
    .chain(x => lib.observable(observer => {

      observer.next({
        op: 'add',
        path: '/observable',
        value: 'works!'
      })

    }))
}
