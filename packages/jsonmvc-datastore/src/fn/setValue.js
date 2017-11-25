
import splitPath from './splitPath'

function setValue(obj, path, val) {
  let parts = splitPath(path)
  let ref = obj

  let last = parts.pop()

  for (let i = 0; i < parts.length; i += 1) {

    if (ref[parts[i]] === undefined) {
      ref[parts[i]] = {}
    }

    ref = ref[parts[i]]
  }

  if (ref) {
    ref[last] = val
  }

}
export default setValue
