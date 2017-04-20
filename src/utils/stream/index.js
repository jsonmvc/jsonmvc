let most = require('most')

// TODO: Rewrite using symbols
let symbol = '__instance__'

function Stream() {
  this[symbol] = {
    op: []
  }
  return this
}

let fns = {}
Object.keys(most).forEach(x => {
  function fn() {
    let instance = !this || !this[symbol] ? new Stream() : this
    instance[symbol].op.push([x, arguments])
    return instance
  }
  fns[x] = fn
  Stream.prototype[x] = fn
})

module.exports = fns
