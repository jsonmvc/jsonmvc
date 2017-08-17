import controllers_init from './controllers/init.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'
import views_form from './views/form.js'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['init'] = controllers_init
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema
exported['views']['form'] = views_form

export default exported