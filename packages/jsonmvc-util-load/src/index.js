
function loadModule (files) {
  let module = {
    controllers: [],
    views: [],
    models: [],
    data: []
  }

  Object.keys(files).forEach(file => {
    let path = file.match(/([a-zA-Z0-9_]+)/gi)
    let componentType = path.shift()
    path.pop()
    let componentName = path.join('/')

    if (module[componentType]) {
      let component = files[file]

      if (!component.name) {
        let path = file.match(/([a-zA-Z0-9_]+)/gi)
        path.pop()
        path.shift()
        component.name = path.join('-')
      }

      module[componentType].push(component)
    }
  })

  module.data = module.data[0]

  return module
}

export default loadModule
