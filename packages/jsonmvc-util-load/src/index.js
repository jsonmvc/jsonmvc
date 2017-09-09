
function loadModule (newModule) {
  let name = newModule.name ? newModule.name : 'app'
  let module = {
    name,
    controllers: [],
    views: [],
    models: [],
    data: []
  }

  let files = newModule.files

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

      if (componentType === 'models' && !component.path) {
        component.path = '/' + component.name.replace('-', '/')
      }

      module[componentType].push(component)
    }
  })

  module.data = module.data[0]

  return module
}

export default loadModule
