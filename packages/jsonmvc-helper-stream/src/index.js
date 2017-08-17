
// TODO: Rewrite using symbols
let symbol = '__instance__'

let keys = [
  'Stream',
  'of',
  'just',
  'empty',
  'never',
  'from',
  'periodic',
  'fromEvent',
  'observe',
  'forEach',
  'drain',
  'loop',
  'scan',
  'reduce',
  'unfold',
  'iterate',
  'generate',
  'concat',
  'startWith',
  'map',
  'constant',
  'tap',
  'ap',
  'transduce',
  'flatMap',
  'chain',
  'join',
  'continueWith',
  'flatMapEnd',
  'concatMap',
  'mergeConcurrently',
  'merge',
  'mergeArray',
  'combine',
  'combineArray',
  'sample',
  'sampleArray',
  'sampleWith',
  'zip',
  'zipArray',
  'switchLatest',
  'switch',
  'filter',
  'skipRepeats',
  'distinct',
  'skipRepeatsWith',
  'distinctBy',
  'take',
  'skip',
  'slice',
  'takeWhile',
  'skipWhile',
  'skipAfter',
  'takeUntil',
  'until',
  'skipUntil',
  'since',
  'during',
  'delay',
  'timestamp',
  'throttle',
  'debounce',
  'fromPromise',
  'awaitPromises',
  'await',
  'recoverWith',
  'flatMapError',
  'throwError',
  'multicast',
  'defaultScheduler',
  'PropagateTask']

function Stream() {
  this[symbol] = {
    op: []
  }
  return this
}

let fns = {}
keys.forEach(x => {
  function fn() {
    let instance = !this || !this[symbol] ? new Stream() : this
    instance[symbol].op.push([x, arguments])
    return instance
  }
  fns[x] = fn
  Stream.prototype[x] = fn
})

export default fns
