import Observable from 'zen-observable'
import * as most from 'most'

module.exports = function observable(db) {
  return function getObservable(cb) {
    let observable = new Observable(cb)
    return most.from(observable)
  }
}
