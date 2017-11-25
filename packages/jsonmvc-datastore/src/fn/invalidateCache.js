
import splitPath from './splitPath'
import decomposePath from './decomposePath'


// @TODO: Instead of using the global 
// static deps object, create a cachedStaticDeps
// in order to parse only the dependencies that 
// are actually cached
//
// @TODO: In order to remove a step, add to the
// cachedStaticDeps all the cacheDynamicList nodes.
//
// Also do not include dynamic deps for inner 
// objects because those are taken cared of at the root

function invalidateCache(db, changed) {
  let cacheDynamic = db.cache.dynamic
  let cachePaths = db.cache.paths
  let staticDeps = db.dynamic.staticDeps
  let decomposed = db.dynamic.decomposed

  let full = changed.full
  let i = changed.full.length
  let j
  let k
  let p
  let changedPath
  let changedPaths
  let part
  let staticDepList
  let dep
  let cacheDynamicList
  let cachedDynamic
  let decomposedList

  while (i--) {
    changedPath = full[i]

    changedPaths = decomposePath(changedPath)
    changedPaths.push(changedPath)

    j = changedPaths.length

    while (j--) {
      part = changedPaths[j]

      delete cachePaths[part]

      staticDepList = staticDeps[part]
      if (staticDepList) {
        k = staticDepList.length

        while (k--) {
          dep = staticDepList[k]

          cacheDynamicList = cacheDynamic[dep]
          if (cacheDynamicList) {
            p = cacheDynamicList.length
            while (p--) {
              delete cachePaths[cacheDynamicList[p]]
            }
          }

          decomposedList = decomposed[dep]
          p = decomposedList.length
          while (p--) {
            delete cachePaths[decomposedList[p]]
          }

        }
      }

      cacheDynamicList = cacheDynamic[part]
      if (cacheDynamicList) {
        k = cacheDynamicList.length
        while (k--) {
          delete cachePaths[cacheDynamicList[k]]
        }
      }
    }
  }

  delete db.cache.paths['/']

}

export default invalidateCache
