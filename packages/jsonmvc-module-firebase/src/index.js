import controllers_emailAuth from './controllers/emailAuth.js'
import controllers_init from './controllers/init.js'
import controllers_session from './controllers/session.js'
import controllers_signOut from './controllers/signOut.js'
import controllers_sync from './controllers/sync.js'
import controllers_update from './controllers/update.js'
import data_initial from './data/initial.json'
import data_schema from './data/schema.json'

let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

exported['controllers']['emailAuth'] = controllers_emailAuth
exported['controllers']['init'] = controllers_init
exported['controllers']['session'] = controllers_session
exported['controllers']['signOut'] = controllers_signOut
exported['controllers']['sync'] = controllers_sync
exported['controllers']['update'] = controllers_update
exported['data']['initial'] = data_initial
exported['data']['schema'] = data_schema

export default exported