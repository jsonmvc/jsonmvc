
import splitPath from './splitPath'
import getValue from './getValue'
import setValue from './setValue'
import decomposePath from './decomposePath'
import setCache from './setCache'
import err from './err'

const getNode = (db, path) => {
  let result
  // @TODO: If there is a schema and the dynamic node
  // then return an empty value for that type:
  // object -> {}
  // array -> []
  // string, number -> null
  //

  // @TODO: Add a flag that enables or disables cache as needed
  //
  // @TODO: Add a flag that clones or gives a reference to the cache
  // as needed

  if (db.cache.paths.hasOwnProperty(path)) {
    return db.cache.paths[path]
  }

  let defaultValue = null

  let decomposed = decomposePath(path)
  let decomposedBkp = decomposed.slice()
  decomposed.unshift(path)

  let dynamicParent
  let dynamicChildren
  let isDynamic = false
  do {
    dynamicParent = decomposed.shift()

    if (db.dynamic.fns[dynamicParent]) {
      isDynamic = true
      dynamicChildren = path.substr(dynamicParent.length)
    }

  } while (decomposed.length != 0 && isDynamic === false)

  let dynamicChildrenBkp = dynamicChildren

  if (isDynamic) {
    let nodes = db.dynamic.deps[dynamicParent]
    let args = nodes.map(x => getNode(db, x))

    // @TODO: decide how to handle case that uses only
    // existing values vs nodes that handle non existing
    // values
    try {
      result = db.dynamic.fns[dynamicParent].apply(null, args)
      if (result === undefined) {
        result = defaultValue
        // @TODO: log this as an error, an edge case
        // that the developer didn't forsee when writing
        // his function
      }
    } catch(e) {
      result = defaultValue
      e.message += `\n path: ${path}`
      e.message += `\n node: ${dynamicParent}`
      err(db, '/err/types/node/5', e.message)
    }

    if (dynamicChildren) {
      dynamicChildren = dynamicChildren.split('/')
      dynamicChildren.shift()

      do {
        let child = dynamicChildren.shift()
        if (result) {
          result = result[child]
        } else {
          result = void 0
          break;
        }
      } while (dynamicChildren.length !== 0)

    }

  } else {
    let val = getValue(db.static, path)

    if (val === undefined && db.dynamic.nesting[path]) {
      val = {}
    }

    // If root was found
    if (val !== undefined) {

      if (val !== null && val.toString && val.toString() === '[object Object]') {
        let nodes = db.dynamic.nesting[path]

        if (nodes) {
          val = nodes.reduce((acc, x) => {
            let node = getNode(db, x)
            let root = x
            if (path !== '/') {
              root = root.replace(path, '')
            }
            setValue(acc, root, node)
            return acc
          }, val)
        }

      } else {
        // val remains the same and does't need cloning
      }

    }

    result = val
  }

  setCache(db, path, result, isDynamic ? dynamicParent : false)

  return result
}

export default getNode
