import transform from 'lodash/transform'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'

module.exports = {
  path: '/fields/create',
  args: ['/fields/data', '/fields/templates', '/fields/options'],
  fn: (data, templates, options) => {

    if (!data || !templates) {
      return {}
    }

    data = JSON.parse(JSON.stringify(data))

    return transform(templates, (acc, val, key) => {

      let keys = Object.keys(val.fields)

      if (val.order) {
        let order = uniq(val.order)
        order.forEach((x, idx) => {
          let i = keys.indexOf(x)
          if (i !== -1) {
            keys.splice(i, 1)
          } else {
            order.splice(idx, 1)
          }
        })
        keys = order.concat(keys)
      }

      let fields = keys.map(x => {
        let field = data[x]

        if (field.dynamicOptions && options) {
          field.options = options[field.dynamicOptions]
          delete field.dynamicOptions
        }

        return field
      })

      acc[key] = fields
    })

  }
}
