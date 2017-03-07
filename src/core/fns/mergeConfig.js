
import { merge } from 'lodash'

function mergeConfig(o1, o2) {

// @TODO: These should not overwrite user defined data
// or at least inform the user that he is trying to overwrite
// a module

  Object.keys(o2).forEach(x => {
    let module = o2[x]

    Object.keys(module.controllers).forEach(y => {
      let c = module.controllers[y]
      o1.controllers[x + y] = c.stream
      o1.schema.controllers[x + y] = c.args[0]
    })

    Object.keys(module.models).forEach(y => {
      let m = module.models[y]
      o1.models[x + y] = m.fn
      o1.schema.models[m.path] = {
        fn: x + y,
        args: m.args
      }
    })

    o1.schema.default = merge(o1.schema.default, module.schema.default)
  })

  return o1
}

module.exports = mergeConfig
