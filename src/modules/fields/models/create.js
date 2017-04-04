import transform from 'lodash/transform'
import reduce from 'lodash/reduce'

module.exports = {
  path: '/fields/create',
  args: ['/fields/data', '/fields/templates', '/fields/options'],
  fn: (data, templates, options) => {

    return transform(templates, (acc, val, key) => {
      acc[key] = transform(val, (acc2, val2, key2) => {
        acc2[key2] = data[key2]

        if (acc2[key2].dynamicOptions && options) {
          acc2[key2].options = options[acc2[key2].dynamicOptions]
          delete acc2[key2].dynamicOptions
        }

      })
    })

  }
}
