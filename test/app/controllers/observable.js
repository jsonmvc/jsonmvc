
module.exports = {
  args: '/bar/baz',
  stream: (stream, lib) => stream
    .chain(x => lib.observable(x => {

      x.next({
        op: 'add',
        path: '/observable',
        value: 'works!'
      })

    }))
}
