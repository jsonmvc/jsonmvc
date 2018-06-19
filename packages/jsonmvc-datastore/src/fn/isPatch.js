
import isValidPath from './isValidPath'
import isValidValue from './isValidValue'

const props = [
  'from',
  'value',
  'path',
  'op'
]

const ops = [
  'add',
  'remove',
  'replace',
  'copy',
  'move',
  'test',
  'merge'
]
function isPatch(schema, patch) {

  if (patch instanceof Array !== true) {
    return false
  }

  for (let i = 0, len = patch.length; i < len; i += 1) {
    let x = patch[i]

    if (!(
      _.isPlainObject(x)
      && isValidPath(x.path)
      && _.difference(Object.keys(x), props).length === 0
      && ops.indexOf(x.op) !== -1
      && ((x.op === 'add' || x.op === 'replace' || x.op === 'test') ? isValidValue(x.value) : true)
      && ((x.op === 'move' || x.op === 'copy') ? isValidPath(x.from) : true)
      )
    ) {
      return false
    }

  }

  return true
}

export default isPatch
