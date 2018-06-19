
function bundleModules (modules) {
  let bundle = _.reduce(modules, (acc, v1) => {
    _.reduce(v1, (acc2, v2, k2) => {
      if (k2 !== 'data' && k2 !== 'name') {
        v2 = _.reduce(v2, (acc3, v3, k3) => {
          acc3[k3] = v3
          return acc3
        }, {})
      }

      if (k2 === 'name') {
        acc[k2] = v2
      } else {
        acc[k2] = _.merge(acc[k2], v2)
      }
      return acc
    }, {})
    return acc
  }, {})

  return bundle
}

export default bundleModules
