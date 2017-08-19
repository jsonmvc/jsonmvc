import gulp from 'gulp'
import glob from 'glob'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'
import now from 'performance-now'
import fs from 'fs'
import { parse as yamlParse } from 'yamljs'

const argv = require('yargs').argv

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = "./../packages"


const forEachPackage = cb => {
  let folders = glob.sync(__dirname + '/packages/*')
  folders.forEach(x => {
    let folder = path.parse(x).name
    cb(folder, folders.length)
  })
}

const buildModule = x => {
  let root = `${__dirname}/packages/${x}/src`
  let header = ''
  let files = glob.sync(root + '/+(controllers|models|views)/**/@(*.js)')
  let imports = ''
  let exports = ''
  let extra = ''

  let data = fs.readFileSync(root + '/data/initial.yml', 'utf-8')
  if (data) {
    data = yamlParse(data)
    exports += `exported.data = ${JSON.stringify(data)}\n`
  }

  files.forEach(y => {
    let filePath = y.replace(root + '/', '')
    let list = filePath.split('/')
    let cat = list.shift()
    let file = list.pop()
    file = file.split('.')
    let fileName = file[0]
    let fileExt = file[1]

    let moduleList = []
    moduleList.push(cat)
    moduleList = moduleList.concat(list)
    moduleList.push(fileName)

    let moduleName = moduleList.join('_')
    imports += `import ${moduleName} from './${filePath}'\n`
    extra += `
${moduleName}.meta = {
  file: "${x + '/' + filePath}"
}`

    list.push(fileName)
    if (cat === 'views') {
      extra += `
${moduleName}.name = '${list.join('-')}'
`
    } else if (cat === 'models') {
    extra += `
${moduleName}.path = '/${list.join('/')}'
`
    }

    exports += `exported.${cat}.push(${moduleName})\n`
  })

  let exported = `
${imports}
${extra}
let exported = {
  views: [],
  models: [],
  controllers: [],
  data: {}
}

${exports}
export default exported
`
  fs.writeFileSync(root + '/index.js', exported, 'utf-8')
}

gulp.task('build:modules', () => {
  forEachPackage((x, count) => {
    if (x.match(/^jsonmvc\-module\-[a-z0-9]+$/)) {
      buildModule(x)
    }
  })
})

gulp.task('clean', () => {
  forEachPackage(x => {
    del.sync([ __dirname + '/packages/' + x + '/dist' ])
    del.sync([ __dirname + '/packages/' + x + '/coverage' ])
  })
})

gulp.task('build', done => {
  let finished = 0

  forEachPackage((x, count) => {
    let config = rollupConfig({
      package: x
    })

    let start = now()

    rollup
      .rollup(config)
      .then(bundle => {
         bundle.write(config)

         let stop = now()
         let dur = ((stop-start) / 1000).toFixed(2)

         console.log(`[ ${dur}s ] ${x}`)
         finished += 1
         if (finished === count) {
          done()
         }
      })
  })
})
