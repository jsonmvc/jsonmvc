import transform from 'lodash/transform'
import reduce from 'lodash/reduce'

module.exports = {
  path: '/fields/create',
  args: ['/fields/data', '/fields/definitions'],
  fn: (data, definitions) => {

    return transform(definitions, (acc, val, key) => {
      acc[key] = reduce(val, (acc2, x) => {
        acc2[x] = data[x]
        return acc2
      }, {})
    })

  }
}
