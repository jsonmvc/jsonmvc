
import decomposePath from './decomposePath'
import uniq from 'uniq'

// Implement https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm for faster search

const extendDeps = deps =>
  Object
    .keys(deps)
    .reduce((acc, x) => {
      acc[x] = deps[x]

      decomposePath(x).forEach(y => {
        acc[y] = deps[x]
      })

      return acc
    }, {})

export default deps => {
  deps = extendDeps(deps)

  let parents = Object.keys(deps)

  let willVisit = parents.reduce((acc, x) => {
    acc[x] = false
    return acc
  }, {})

  let isCyclic = false

  root:
  for (let i = 0; i < parents.length; i += 1) {
    let visited = Object.assign({}, willVisit)
    let parent = parents[i]
    let children = deps[parent].slice()

    while (children.length > 0) {
      let child = children.shift()

      if (deps[child]) {
        if (visited[child]) {
          isCyclic = true
          break root
        } else {
          visited[child] = true
          children = children.concat(deps[child])
          children = uniq(children)
        }
      } else {
        // Its a static node so we don't care
      }
    }
  }

  return isCyclic
}
