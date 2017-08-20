import transform from 'lodash-es/transform'
import forEach from 'lodash-es/forEach'

const model = {
  path: '/fields/update',
  args: {
    fields: '/fields/create',
    data: '/data'
  },
  fn: args => {
    return transform(args.fields, (acc, val, key) => {
      acc[key] = {}
      forEach(args.data[key], (val2, key2) => {
        acc[key][key2] = {}
        forEach(val, val3 => {
          let value = args.data[key][key2][val3.key]

          let result = Object.assign({}, { value }, val3)

          acc[key][key2][val3.key] = result
        })
      })
    })
  }
}

export default model
