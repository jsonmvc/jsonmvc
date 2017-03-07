
const libContext = require.context('_libs/', true, /\.js/)
const libFile = /^\.\/([a-z0-9]+)/gi
let libFns = {}

libContext.keys().forEach(x => {
  let name = new RegExp(libFile).exec(x)[1]
  libFns[name] = libContext(x)
})

const lib = (namespace, db) => {
  return Object.keys(libFns).reduce((acc, x) => {
    acc[x] = libFns[x](namespace, db)
    return acc
  }, {})
}

module.exports = lib
