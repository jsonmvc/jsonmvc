
import transform from 'lodash-es/transform'
import reduce from 'lodash-es/reduce'

const model = {
  path: '/compiled',
  args: {
    data: '/data',
    fields: '/fields/data',
    options: '/fields/options'
  },
  fn: args => {
    if (!args.data || !args.fields || !args.options) {
      return {}
    }

    return transform(args.data, (acc, v, k) => {
      acc[k] = transform(v, (acc2, v2, k2) => {
        acc2[k2] = transform(v2, (acc3, v3, k3) => {
          let f = args.fields[k3]

          if (f && f.dynamicOptions && args.options[f.dynamicOptions] && args.options[f.dynamicOptions][v3]) {
            acc3[k3] = args.options[f.dynamicOptions][v3].name
          } else {
            acc3[k3] = v3
          }
        })
      })
    })
  }
}

export default model
