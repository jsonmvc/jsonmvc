
import { forEach } from 'lodash'

function createModels(db, models) {

  forEach(models, model => {
    let keys = Object.keys(model.args)
    let args = keys.map(x => model.args[x])

    model.remove = db.node(model.path, args, function () {
      let fnArgs = Array.prototype.slice.call(arguments)

      let argsObj = fnArgs.reduce((acc, x, i) => {
        acc[keys[i]] = x
        return acc
      }, {})

      return model.fn(argsObj)
    })
  })

  return models
}

module.exports = createModels
