
import { forEach } from 'lodash'

function createModels(db, models) {

  forEach(models, model => {
    db.node(model.path, model.args, model.fn)
    model.remove = () => console.log('Should remove the node')
  })

  return models
}

module.exports = createModels
