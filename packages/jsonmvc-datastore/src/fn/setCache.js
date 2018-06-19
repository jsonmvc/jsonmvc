
import splitPath from './splitPath'

function setCache(db, path, value, dynamicParent) {

  db.cache.paths[path] = _.clone(value)

  if (dynamicParent && db.cache.dynamic[dynamicParent].indexOf(path) === -1) {
    db.cache.dynamic[dynamicParent].push(path)
  }

}

export default setCache
