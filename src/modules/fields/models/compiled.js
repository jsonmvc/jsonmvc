
import transform from 'lodash/transform'
import reduce from 'lodash/reduce'

module.exports = {
  path: '/compiled',
  args: [
    '/data',
    '/fields/data',
    '/fields/options'
  ],
  fn: (data, fields, options) => {

    if (!data || !fields || !options) {
      return {}
    }

    return transform(data, (acc, v, k) => {
      acc[k] = transform(v, (acc2, v2, k2) => {
        acc2[k2] = transform(v2, (acc3, v3, k3) => {
          let f = fields[k3]

          if (f && f.dynamicOptions && options[f.dynamicOptions] && options[f.dynamicOptions][v3]) {
            acc3[k3] = options[f.dynamicOptions][v3].name
          } else {
            acc3[k3] = v3
          }
        })
      })
    })

  }
}
