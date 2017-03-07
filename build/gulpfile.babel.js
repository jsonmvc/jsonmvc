
process.chdir(process.env.ROOT_PATH)
console.log(`Working directory was changed to: ${process.cwd()}`)

import gulp from 'gulp'
import gutil from 'gulp-util'
import gulpSync from 'gulp-sync'
import del from 'del'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'
import webpackNodeConfig from './webpack.node.js'

const sync = gulpSync(gulp).sync

console.log('Started in ', process.env.NODE_ENV, ' mode')

/**
 * browser:build
 *
 * Builds the browser code from src to dist/browser
 * Uses webpack to compile the code.
 */
gulp.task('browser:build', done => {
  webpack(webpackConfig).run(() => done())
})

gulp.task('node:build', done => {
  webpack(webpackNodeConfig).run(() => done())
})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))

/* browser:dev */
gulp.task('browser:dev', () => {
  let compiler = webpack(webpackConfig)
  let server = new WebpackDevServer(compiler, webpackConfig.devServer)
  let port = webpackConfig.devServer.port
  let host = webpackConfig.devServer.host

  let fn = err => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err)
    gutil.log("[webpack-dev-server]", "http://" + host + ":" + port)
  }

  server.listen(port, host, fn)
})

/* build */
gulp.task('start:production', sync(['clean', 'browser:build', 'node:build']))
gulp.task('start:development', ['browser:dev'])
gulp.task('start:test')
