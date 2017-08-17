import controllers_clearForm from './controllers/clearForm.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'
import models_submit from './models/submit.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['clearForm'] = controllers_clearForm
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema
exported['models']['submit'] = models_submit

export default exported