import Observable from 'zen-observable'
import * as most from 'most'

module.exports = function observer(cb) {
  let observable = new Observable(cb)
  return most.from(observable)
}
