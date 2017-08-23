
import stringify from './fns/stringify'

function updateModule (instance, newModule) {
  try {
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

      if (instance.module[x]) {
        Object.keys(instance.module[x]).forEach(y => {
          if (!newModule[x] || !newModule[x][y]) {
            // changes[x][y] = false
          } else if (stringify(newModule[x][y]) !== stringify(instance.module[x][y])) {
            changes[x].push(newModule[x][y])
            instance.module[x][y] = newModule[x][y]
          }
        })
      }

      if (newModule[x]) {
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

    instance.update(changes)
  } catch (e) {
    console.error('Updating instance failed with error', e)
    console.error(e.stack)
  }
}

export default updateModule
