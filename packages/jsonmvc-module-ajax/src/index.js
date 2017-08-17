import controllers_patch from './controllers/patch.js'
import controllers_request from './controllers/request.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'
import models_byLabel from './models/byLabel.js'
import models_byStatus from './models/byStatus.js'
import models_ids from './models/ids.js'
import models_lastByLabel from './models/lastByLabel.js'
import models_toPatch from './models/toPatch.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['patch'] = controllers_patch
exported['controllers']['request'] = controllers_request
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema
exported['models']['byLabel'] = models_byLabel
exported['models']['byStatus'] = models_byStatus
exported['models']['ids'] = models_ids
exported['models']['lastByLabel'] = models_lastByLabel
exported['models']['toPatch'] = models_toPatch

export default exported