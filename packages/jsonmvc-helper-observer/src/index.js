import Observable from 'zen-observable'

export default function observer(cb) {
  let observable = new Observable(cb)
  return most.from(observable)
}
