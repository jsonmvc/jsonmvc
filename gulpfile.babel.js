import gulp from 'gulp'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'

const argv = require('yargs').argv

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = "./../packages"

gulp.task('build', () => {

  let config = rollupConfig({
    package: argv.package
  })

  del.sync([ __dirname + '/packages/' + argv.package + '/dist' ])

  return rollup.rollup(config)
    .then(bundle => {
       bundle.write(config)
    })
})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))
