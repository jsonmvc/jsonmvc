
import splitPath from './splitPath'

export default (obj, path) => {
  let parts = splitPath(path)
  let val = obj
  let isRoot = parts.length === 1 && parts[0] === ''

  if (!isRoot) {

    for (let i = 0; i < parts.length; i += 1) {
      if (val && val[parts[i]] !== undefined) {
        val = val[parts[i]]
      } else {
        val = undefined
        break
      }
    }

  }

  if (val
    && val.toString
    && (val.toString() === '[object Object]'
      || val instanceof Array)
  ) {
    val = JSON.parse(JSON.stringify(val))
  }

  return val
}
