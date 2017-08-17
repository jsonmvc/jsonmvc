import controllers_events from './controllers/events.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'
import models_isAppMounted from './models/isAppMounted.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['events'] = controllers_events
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema
exported['models']['isAppMounted'] = models_isAppMounted

export default exported