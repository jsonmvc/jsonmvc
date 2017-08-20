
import reduce from 'lodash-es/reduce'
import merge from 'lodash-es/merge'

function bundleModules (modules) {
  let bundle = reduce(modules, (acc, v1, k1) => {
    reduce(v1, (acc2, v2, k2) => {
      if (k2 !== 'data') {
        v2 = reduce(v2, (acc3, v3, k3) => {
          acc3[k1 + '/' + k3] = v3
          return acc3
        }, {})
      }
      acc[k2] = merge(acc[k2], v2)
      return acc
    }, {})
    return acc
  }, {})

  return bundle
}

export default bundleModules
