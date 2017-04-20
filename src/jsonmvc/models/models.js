
import { forEach } from 'lodash'

function createModels(db, models) {

  forEach(models, model => {
    model.remove = db.node(model.path, model.args, model.fn)
  })

  return models
}

module.exports = createModels
