
import { stream } from '_utils'

module.exports = {
  args: {
    baloo: '/baloo'
  },
  fn: stream
    .map((x, lib) => lib.ajax({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      labels: ['google'],
      patch: true
    }))
    .tap(x => console.log(x, '13'))
}
