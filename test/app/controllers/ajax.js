
module.exports = {
  args: {
    baloo: '/baloo'
  },
  fn: (stream, lib) => {
    return stream.map(x => lib.ajax({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      labels: ['google'],
      patch: true
    }))
    .tap(x => console.log(x, '13'))
  }
}
