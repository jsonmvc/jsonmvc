
import { reduce, clone } from 'lodash'

function createModels(db, models) {

  let instances = reduce(models, (acc, model, k) => {
    acc[k] = clone(model)

    acc[k].remove = db.node(model.path, model.args, model.fn)

    return acc
  }, {})

  return instances
}

module.exports = createModels
