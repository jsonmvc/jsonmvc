import transform from 'lodash/transform'
import reduce from 'lodash/reduce'

module.exports = {
  path: '/fields/create',
  args: ['/fields/data', '/fields/templates'],
  fn: (data, templates) => {

    return transform(templates, (acc, val, key) => {
      acc[key] = transform(val, (acc2, val2, key2) => {
        acc2[key2] = data[key2]
      })
    })

  }
}
