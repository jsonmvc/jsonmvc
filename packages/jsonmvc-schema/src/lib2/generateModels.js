
const clone = require('lodash/cloneDeep')
const models = {
  validation: require('./../models/validation')
}

module.exports = function generateModels(schema, path) {
  let list = []
  path = path || ''

  if (schema.$model) {
    let model = models[schema.$model]
    let props = schema.props
    let args = clone(model.args)
    let fn = model.fn

    for (let i in props) {
      for (let j in args) {
        args[j] = args[j].replace('<' + i + '>', props[i])
      }
    }

    list.push({
      path,
      args: args,
      fn: fn
    })
  } else if (schema.type === 'object') {
    if (schema.properties) {
      for (let i in schema.properties) {
        list = list.concat(generateModels(schema.properties[i], path + '/' + i))
      }
    }
  }

  return list
}