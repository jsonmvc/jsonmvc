
import controllers_ms from './controllers/ms.js'
import models_time_hh from './models/time/hh.js'
import models_time_hhmmss from './models/time/hhmmss.js'
import models_time_mm from './models/time/mm.js'


controllers_ms.meta = {
  file: "controllers/ms.js"
}
models_time_hh.meta = {
  file: "models/time/hh.js"
}
models_time_hhmmss.meta = {
  file: "models/time/hhmmss.js"
}
models_time_mm.meta = {
  file: "models/time/mm.js"
}
let exported = {
  views: [],
  models: [],
  controllers: [],
  data: {}
}

exported.data = {"config":{"time":{"interval":500}}}
exported.controllers.push(controllers_ms)
exported.models.push(models_time_hh)
exported.models.push(models_time_hhmmss)
exported.models.push(models_time_mm)

export default exported
