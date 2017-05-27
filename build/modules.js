
const fs = require('fs')
const yamljs = require('yamljs')
const moduleName = process.env.MODULE

let folders = ['models', 'controllers', 'views']

let modulesPath = `${__dirname}/../src/modules`

let modulesList = fs.readdirSync(modulesPath)

let moduleIndexHeader = ''
let moduleIndexExported = `let exported = {
`

modulesList.forEach(moduleName => {

  if (moduleName.indexOf('.') > -1) {
    return
  }

  let modulePath = `${modulesPath}/${moduleName}`

  let header = ''
  let exported = `let exported = {
  views: {},
  models: {},
  controllers: {},
  data: {}
}

`
  let folders = fs.readdirSync(modulePath)

  folders.map(x => {
    if (x.indexOf('.') > -1 || x === 'fns') {
      return
    }

    let path = modulePath + '/' + x
    let files = fs.readdirSync(path)
    files.forEach(z => {
      let file = z.split('.')
      let name = file[0]
      let ext = file[1]

      // exclude
      if (
        x === 'data'
        && ext === 'js'
        ) {
        return
      }

      if (ext === 'yml') {
        let data = fs.readFileSync(path + '/' + z, 'utf-8')
        data = yamljs.parse(data)
        data = JSON.stringify(data)
        data = 'export default ' + data
        fs.writeFileSync(path + '/' + name + '.js', data, 'utf-8')
        z = name + '.js'
      }

      header += `import ${x}_${name} from './${x}/${z}'\n`
      exported += `exported['${x}']['${name}'] = ${x}_${name}\n`
    })
  })

  exported += '\nexport default exported'

  let finalFile = header + '\n' + exported

  fs.writeFileSync(modulePath + '/index.js', finalFile, 'utf-8')
  moduleIndexHeader += `import ${moduleName} from './${moduleName}/index.js'\n`
  moduleIndexExported += `\t${moduleName}: ${moduleName},\n`
})

moduleIndexExported += '}\n\n'
moduleIndexExported += 'export default exported'

let moduleIndex = moduleIndexHeader + '\n' + moduleIndexExported

fs.writeFileSync(modulesPath + '/index.js', moduleIndex, 'utf-8')
