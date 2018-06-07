import gulp from 'gulp'
import glob from 'glob'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'
import now from 'performance-now'
import fs from 'fs'
import { parse as yamlParse } from 'yamljs'
import babel from 'gulp-babel'

const argv = require('yargs').argv

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = './../packages'

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

  exports += `exported.name = '${x}'\n`

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
  let builds = {}

  function startBuild(buildName) {
    builds[buildName] = {
      startedAt: now()
    }
  }

  function finishBuild(buildName, count) {
    let build = builds[buildName]
    build.finishedAt = now()
    build.duration = ((build.finishedAt - build.startedAt) / 1000).toFixed(2)

    console.log(`[ ${build.duration}s ] ${buildName}`)

    finished += 1
    if (finished === count) {
      done()
    }
  }

  const rollupAnalyzer = require('rollup-analyzer')({limit: 5})

  function buildBrowser(packageName, baseFolder) {
    let packageJSON = require(baseFolder + '/package.json')
    let config = rollupConfig({
      package: packageName
    })

    let deps = []
    if (packageJSON.dependencies) {
      deps = Object.keys(packageJSON.dependencies)
    }

    config.external = deps
    deps = deps.filter(x => x !== 'vue')
    config.globals = deps.reduce((acc, x) => {
      acc[x] = x
      return acc
    }, {})

    return rollup
      .rollup(config)
      .then(bundle => {
        rollupAnalyzer.formatted(bundle).then(console.log).catch(console.error)
        bundle.write(config)
      })
  }

  function buildNode(packageName, baseFolder) {
    return new Promise((resolve, reject) => {
      gulp.src(baseFolder + '/src/**/*.js')
        .pipe(babel({
          "presets": [
            ["env", {
              "targets": {
                "node": "0.10"
              }
            }]
          ]
        }))
        .pipe(gulp.dest(baseFolder + '/dist'))
        .on('end', resolve)
        .on('error', reject)
    })
  }

  forEachPackage((x, count) => {
    let baseFolder = __dirname + '/packages/' + x
    let packageJSON = require(baseFolder + '/package.json')

    startBuild(x)

    let build
    if (packageJSON.browser) {
      build = buildBrowser(x, baseFolder)
    } else {
      build = buildNode(x, baseFolder)
    }

    build
      .then(() => {
        finishBuild(x, count)
      })
      .catch(e => {
        console.error(e)
      })
  })
})
