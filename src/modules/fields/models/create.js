import transform from 'lodash/transform'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'

module.exports = {
  path: '/fields/create',
  args: {
    data: '/fields/data',
    templates: '/fields/templates',
    options: '/fields/options'
  },
  fn: args => {

    if (!args.data || !args.templates) {
      return {}
    }

    let data = JSON.parse(JSON.stringify(args.data))

    return transform(args.templates, (acc, val, key) => {

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

        if (field.dynamicOptions && args.options) {
          field.options = args.options[field.dynamicOptions]
          delete field.dynamicOptions
        }

        return field
      })

      acc[key] = fields
    })

  }
}
