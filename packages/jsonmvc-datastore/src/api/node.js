
import isCyclic from './../fn/isCyclic'
import decomposePath from './../fn/decomposePath'
import err from './../fn/err'
import isValidPath from './../fn/isValidPath'
import clearNode from './../fn/clearNode'
import triggerListener from './../fn/triggerListener'
import pathTriggers from './../fn/pathTriggers'
import expandNodeDeps from './../fn/expandNodeDeps'
import invalidateCache from './../fn/invalidateCache'
import updateTriggers from './../fn/updateTriggers'

// !Importat.
// When adding a new node previous listeners should be refreshed
// in order to be triggered by updates on the node's
// dependencies

/**
 * node
 *
 * Adds a dynamic node
 */
const node = db => (path, deps, fn) => {

  let node = {
    path: path,
    deps: deps,
    fn: fn
  }

  if (fn instanceof Function === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  if (deps instanceof Array === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  // @TODO: Add this to warnings
  /*
  if (deps.length !== fn.length) {
    err(db, '/err/types/node/4', node)
    return
  }
  */

  let paths = deps.concat(path)
  let validPaths = paths.filter(isValidPath)

  if (validPaths.length !== paths.length) {
    err(db, '/err/types/node/2', node)
    return
  }

  db.dynamic.deps[path] = deps

  if (isCyclic(db.dynamic.deps)) {
    delete db.dynamic.deps[path]
    err(db, '/err/types/node/3', node)
    return
  }

  db.dynamic.fns[path] = fn

  // @TODO: When adding in dynamic nesting always reorder
  // based on the nesting depth - deepest last so that
  // when iterating for computation the deepest nodes
  // should be already computed when reaching the top
  // ones.
  //
  // @TODO: Add the root to the nesting so that:
  // db.get('/') also gets all the dynamic nodes in
  let xs = decomposePath(path)
  xs.push('/')
  xs.map(x => {
    if (!db.dynamic.nesting[x]) {
      db.dynamic.nesting[x] = []
    }

    if (db.dynamic.nesting[x].indexOf(path) === -1) {
      db.dynamic.nesting[x].push(path)
    }
  })


  // @TODO: Based on this nesting create a new array that
  // contains also the dependencies of the nested nodes
  // thus generating the entire list of nodes.
  // Also order them depth last
  // nestingShallow
  // nestingDeep

  node.deps.forEach(x => {

    if (!db.dynamic.reverseDeps[x]) {
      db.dynamic.reverseDeps[x] = [node.path]
    } else {
      db.dynamic.reverseDeps[x].push(node.path)
    }

    let dep = decomposePath(x)

    dep.forEach(y => {
      if (!db.dynamic.inverseDeps[y]) {
        db.dynamic.inverseDeps[y] = [node.path]
      } else {
        db.dynamic.inverseDeps[y].push(node.path)
      }
    })

  })

  expandNodeDeps(db.dynamic)

  db.cache.dynamic[node.path] = []

  // Search for any cached values on the node.path
  // as a result of requesting the path before the
  // node was created
  let reg = new RegExp('^' + node.path)
  Object.keys(db.cache.paths).forEach(x => {
    if (x.search(reg) !== -1) {
      delete db.cache.paths[x]
    }
  })

  invalidateCache(db, { full: [node.path] })

  Object.keys(db.updates.fns).forEach(x => {
    updateTriggers(db, x)
  })

  pathTriggers(db, path).map(x => {
    triggerListener(db, x)
  })

  return function removeNode() {

    let triggers = pathTriggers(db, path)
    delete db.dynamic.fns[path]

    invalidateCache(db, { full: [node.path] })
    delete db.cache.dynamic[path]

    clearNode(db.dynamic.nesting, path)

    triggers.map(x => {
      triggerListener(db, x)
    })
  }
}

export default node
