
import isEqual from 'lodash-es/isEqual'
import flatten from 'lodash-es/flatten'
import isNumber from 'lodash-es/isNumber'
import isArray from 'lodash-es/isArray'
import isPlainObject from 'lodash-es/isPlainObject'
import merge from 'lodash-es/merge'
import splitPath from './splitPath'
import decomposePath from './decomposePath'
import clone from 'lodash-es/cloneDeep'
import triggerListener from './triggerListener'
import pathTriggers from './pathTriggers'

function clearDynamic(cachePaths, cacheDynamic, decomposed, staticDeps, path) {
  let staticDepList = staticDeps[path]
  if (staticDepList) {
    let cacheDynamicList
    let decomposedList
    let k
    let p
    let dep
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
}

function clearCacheRecursive(cachePaths, cacheDynamic, decomposed, staticDeps, path, obj) {
  if (isPlainObject(obj)) {
    let k = Object.keys(obj)
    let i = k.length
    let prop
    let newPath

    while (i--) {
      prop = k[i]
      newPath = path + '/' + prop
      delete cachePaths[newPath]
      clearCacheRecursive(cachePaths, cacheDynamic, decomposed, staticDeps, newPath, obj[prop])
      clearDynamic(cachePaths, cacheDynamic, decomposed, staticDeps, newPath)
    }
  }
}

function applyPatch(db, patch, shouldClone) {

  let i, x, parts, len, j, lenj, obj, part, last, to, found, temp, from, lastFrom
  let revert
  let changed = {
    full: [],
    partial: []
  }

  let isTest
  let fullPath
  let cachePaths = db.cache.paths
  let decomposed = db.dynamic.decomposed
  let cacheDynamic = db.cache.dynamic
  let staticDeps = db.dynamic.staticDeps

  root:
  for (i = 0, len = patch.length; i < len; i += 1) {
    let path = ''
    let xPath
    let xValue
    let objIsArray = false
    let fromIsArray = false
    x = patch[i]
    xPath = x.path
    xValue = x.value

    // @TODO: Add test/move/copy cases for deleting cache
    delete cachePaths[xPath]
    clearCacheRecursive(cachePaths, cacheDynamic, decomposed, staticDeps, xPath, xValue)
    clearDynamic(cachePaths, cacheDynamic, decomposed, staticDeps, xPath)

    // @TODO: Implement both path && from in a function
    parts = splitPath(xPath)
    obj = db.static
    for (j = 0, lenj = parts.length - 1; j < lenj; j += 1) {

      part = parts[j]
      path += '/' + part

      if (!obj[part] && x.op === 'add') {
        obj[part] = {}
        obj = obj[part]
      } else {
        obj = obj[part]
        if (!obj) {
          revert = i
          break root
        }
      }

      delete cachePaths[path]
      clearDynamic(cachePaths, cacheDynamic, decomposed, staticDeps, path)
    }

    last = parts[parts.length - 1]

    if (x.op === 'move' || x.op === 'copy') {
      parts = splitPath(x.from)
      from = db.static
      for (j = 0, lenj = parts.length - 1; j < lenj; j += 1) {
        if (from[parts[j]])  {
          from = from[parts[j]]
        } else {
          revert = i
          break
        }
      }

      lastFrom = parts[parts.length - 1]
    }

    if (isArray(obj)) {
      objIsArray = true
      if (last === '-') {
        last = obj.length
      } else if (!isNumber(last)) {
        // Must be a number, else what's the point in
        // trying to cast it to one?
        let initial = last
        last = parseInt(last, 10)

        if (isNaN(last) || initial.toString() !== last.toString()) {
          revert = i
          break root
        }
      }
      if (last > obj.length || last < 0) {
        revert = i
        break root
      }
    }

    if (isArray(from)) {
      fromIsArray = true
      if (lastFrom === '-') {
        lastFrom = from.length - 1
      } else if (!isNumber(lastFrom)) {
        // Must be a number, else what's the point in
        // trying to cast it to one?
        let initial = lastFrom
        lastFrom = parseInt(lastFrom, 10)

        if (isNaN(lastFrom) || initial.toString() !== lastFrom.toString()) {
          revert = i
          break root
        }
      }
      if (lastFrom > from.length || lastFrom < 0) {
        revert = i
        break root
      }
    }

    switch (x.op) {

      case 'add':
      case 'replace':

        if (objIsArray) {
          obj.splice(last, 0, shouldClone ? clone(xValue) : xValue)
        } else if (isPlainObject(obj)) {
          obj[last] = shouldClone ? clone(xValue) : xValue
        }
      break

      case 'remove':
        if (objIsArray) {
          obj.splice(last, 1)
        } else {
          delete obj[last]
        }
      break

      case 'copy':
      case 'move':

        temp = from[lastFrom]

        if (x.op === 'move') {
          delete from[lastFrom]
        } else if (isPlainObject(temp)) {
          temp = clone(temp)
        }

        obj[last] = temp

      break

      case 'test':
        if (!isEqual(obj[last], xValue)) {
          revert = i
          break root
        }
      break

      case 'merge':
        if (!isPlainObject(obj[last])) {
          revert = i
          break root
        }
        obj[last] = merge(obj[last], xValue)
      break
    }
  }

  if (revert !== undefined) {
    // @TODO: Revert all changes done up until revertIndex
  }

  let trigger = []

  patch.forEach(x => {
    trigger = trigger.concat(pathTriggers(db, x.path))
  })

  trigger = flatten(trigger)

  trigger.map(x => {
    triggerListener(db, x)
  })

  return {
    revert,
    changed
  }

}

export default applyPatch
