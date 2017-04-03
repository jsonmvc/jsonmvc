import transform from 'lodash/transform'
import forEach from 'lodash/forEach'

module.exports = {
  path: '/fields/update',
  args: ['/fields/create', '/data'],
  fn: (fields, data) => {

    return transform(fields, (acc, val, key) => {
      acc[key] = {}
      forEach(data[key], (val2, key2) => {
        acc[key][key2] = {}
        forEach(val, (val3, key3) => {
          acc[key][key2][key3] = Object.assign({ value: data[key][key2][key3] }, val[key3])
        })
      })
    })

  }
}
