import mountView from '_fns/mountView'
import stringify from '_fns/stringify'
import loadModule from '_fns/loadModule'

function reloadHMR(instance, context) {
  try {
    let newModule = loadModule(context)
    let changes = {
      controllers: {},
      models: {},
      views: {},
      data: {}
    }

    Object.keys(instance.module).forEach(x => {

      Object.keys(instance.module[x]).forEach(y => {
        if (!newModule[x][y]) {
          changes[x][y] = false
        } else if (stringify(newModule[x][y]) !== stringify(instance.module[x][y])) {
          changes[x][y] = newModule[x][y]
          instance.module[x][y] = newModule[x][y]
        }
      })

      Object.keys(newModule[x]).forEach(y => {
        if (!instance.module[x][y]) {
          changes[x][y] = newModule[x][y]
        }
      })

    })

    // Because using Vue doesn't allow changing children
    // we need to recreate the whole tree
    // @TODO: Remove this once Vue is removed from the framework
    if (Object.keys(changes.views).length > 0) {
      changes.views = newModule.views
    }

    instance.update(changes)
  } catch (e) {
    console.error('HMR Reload failed with error', e)
    console.error(e.stack)
  }
}

module.exports = reloadHMR
