
function loadModule (context) {
  let module = {
    controllers: [],
    views: [],
    models: [],
    data: []
  }

  context.keys().forEach(file => {
    let path = file.match(/([a-zA-Z0-9_]+)/gi)
    let componentType = path.shift()
    path.pop()
    let componentName = path.join('/')

    if (module[componentType]) {
      let component = context(file)
      component.file = file
      module[componentType].push(component)
    }
  })

  module.views = module.views.map(x => {
    if (!x.name && x.file) {
      let path = x.file.match(/([a-zA-Z0-9_]+)/gi)
      path.pop()
      path.shift()
      x.name = path.join('-')
    }
    return x
  })

  module.data = module.data[0]

  return module
}

export default loadModule
