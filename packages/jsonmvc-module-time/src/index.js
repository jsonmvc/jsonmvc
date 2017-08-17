import controllers_ms from './controllers/ms.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'
import models_hh from './models/hh.js'
import models_hhmmss from './models/hhmmss.js'
import models_mm from './models/mm.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['ms'] = controllers_ms
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema
exported['models']['hh'] = models_hh
exported['models']['hhmmss'] = models_hhmmss
exported['models']['mm'] = models_mm

export default exported