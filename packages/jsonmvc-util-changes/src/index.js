
import stringify from './fns/stringify'

function changes (instance, newModule) {

  let changes = {
    controllers: [],
    models: [],
    views: [],
    data: {}
  }

  Object.keys(instance.module).forEach(x => {
    if (x === 'name') {
      return
    }

    if (instance.module[x] && newModule[x]) {
      if (x === 'data') {
        if (JSON.stringify(instance.module[x]) !== JSON.stringify(newModule[x])) {
          changes.data = newModule[x]
        }
      } else {
        newModule[x].forEach(y => {
          if (!y.name) {
            throw new Error(`Module ${y} does not have a "name" property specified and cannot be updated. Please add an unique "name" property.`)
          }

          if (instance.module[x][y.name]) {
            let a = stringify(instance.module[x][y.name])
            let b = stringify(y)
            if (a !== b) {
              changes[x].push(y)
            }
          } else {
            changes[x].push(y)
          }
        })
      }
    } else if (!instance.module[x] && newModule[x]) {
      if (x === 'data') {
        changes.data = newModule[x]
      } else {
        Object.keys(newModule[x]).forEach(y => {
          if (!instance.module[x] || !instance.module[x][y]) {
            changes[x].push(newModule[x][y])
          }
        })
      }
    }
  })

  // Because using Vue doesn't allow changing children
  // we need to recreate the whole tree
  // @TODO: Remove this once Vue is removed from the framework
  if (Object.keys(changes.views).length > 0) {
    changes.views = newModule.views
  }

  return changes
}

export default changes
