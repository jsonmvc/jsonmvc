
import getValue from './getValue'
import splitPath from './splitPath'

function pathExists(db, path) {
  let parts = splitPath(path)
  let val = db.static

  for (let i = 0; i < parts.length; i += 1) {
    if (val[parts[i]] !== undefined) {
      val = val[parts[i]]
    } else {
      val = undefined
      break
    }
  }

  let hasStaticNode = val !== undefined
  let hasDynamicNode = db.dynamic.fns[path] !== undefined

  return hasStaticNode || hasDynamicNode
}

export default pathExists
