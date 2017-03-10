
module.exports = {
  args: '/foo',
  stream: stream => stream
    .delay(1000)
    .map(x => x + 1)
    .map(x => ({
      op: 'add',
      path: '/foo',
      value: x
    }))
}
