import gulp from 'gulp'
import glob from 'glob'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'
import now from 'performance-now'

const argv = require('yargs').argv

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = "./../packages"


const forEachPackage = cb => {
  glob(__dirname + '/packages/*', (err, folders) => {
    let len = folders.length
    folders.forEach(x => {
      let folder = path.parse(x).name
      cb(folder, len)
    })
  })
}

gulp.task('clean', () => {
  forEachPackage((x, count) => {
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
