import gulp from 'gulp'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'

const argv = require('yargs').argv

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = "./../packages"

gulp.task('clean', () => {
  del.sync([ __dirname + '/packages/' + argv.package + '/dist' ])
  del.sync([ __dirname + '/packages/' + argv.package + '/coverage' ])
})

gulp.task('build', () => {

  let config = rollupConfig({
    package: argv.package
  })

  return rollup.rollup(config)
    .then(bundle => {
       bundle.write(config)
    })
})
