
import decomposePath from './decomposePath'
import uniq from 'lodash-es/uniq'

function getFullDeps(nodesDeps, path, deps) {
  let nodeDeps = nodesDeps[path]

  if (!deps) {
    deps = []
  }

  let paths = Object.keys(nodesDeps)

  for (let j = 0; j < nodeDeps.length; j += 1) {
    let dep = nodeDeps[j]
    let reg = new RegExp('^' + dep)
    let parts = decomposePath(dep)
    parts.push(dep)
    let selected = false

    // Add all dynamic nodes
    for (let k = 0; k < paths.length; k += 1) {
      let cur = paths[k]

      if ((parts.indexOf(cur) !== -1 || cur.match(reg) !== null) && deps.indexOf(cur) === -1) {
        selected = true
        deps.push(cur)
        getFullDeps(nodesDeps, cur, deps)

        let curParts = decomposePath(cur)

        // if the path is a child of the dep then
        // it is a static node containing a child dynamic
        // node
        if (curParts.length > parts.length) {
          deps.push(dep)
        }
      }
    }

    // Add static nodes
    if (selected === false) {
      deps.push(dep)
    }
  }

  return deps
}

export default getFullDeps
