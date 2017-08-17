import data_initial from './data/initial.json'
import models_compiled from './models/compiled.js'
import models_create from './models/create.js'
import models_update from './models/update.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['data']['initial'] = data_initial
exported['models']['compiled'] = models_compiled
exported['models']['create'] = models_create
exported['models']['update'] = models_update

export default exported