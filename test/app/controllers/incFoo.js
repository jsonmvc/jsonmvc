
module.exports = {
  args: '/foo',
  stream: stream => stream
    .delay(1000)
    .map(x => x + 2)
    .map(x => ({
      op: 'add',
      path: '/foo',
      value: x
    }))
}
