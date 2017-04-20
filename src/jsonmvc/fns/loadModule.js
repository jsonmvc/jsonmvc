
function loadModule(context) {
  let module = {
    controllers: {},
    views: {},
    models: {},
    data: {}
  }

  context.keys().forEach(file => {

    let path = file.match(/([a-zA-Z0-9_]+)/gi)
    let componentType = path.shift()
    path.pop()
    let componentName = path.join('/')

    if (module[componentType]) {
      module[componentType][componentName] = context(file)
    }

  })

  return module
}

module.exports = loadModule
