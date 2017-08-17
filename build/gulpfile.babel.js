import gulp from 'gulp'
import del from 'del'
import { lstatSync, readdirSync } from 'fs'
import path from 'path'

const rollup = require('rollup')
const rollupConfig = require('./rollup.config.js')

const base = path.join(__dirname, '..', 'packages')
const scripts = "./../packages"

gulp.task('build', () => {

  return rollup.rollup(rollupConfig)
    .then(bundle => {
       bundle.write(rollupConfig)
    })
})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))
