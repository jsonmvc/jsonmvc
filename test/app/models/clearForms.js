import { reduce } from 'lodash'

module.exports = {
  path: '/forms/clear',
  args: ['/forms/submit'],
  fn: x => {
    return reduce(x, (acc, v, k) => {
      Object.keys(v).forEach(id => {
        acc.push({
          name: k,
          id: id
        })
      })
      return acc
    }, [])
  }
}
