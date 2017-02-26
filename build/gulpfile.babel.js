
process.chdir(process.env.ROOT_PATH)
console.log(`Working directory was changed to: ${process.cwd()}`)

import gulp from 'gulp'
import gutil from 'gulp-util'
import gulpSync from 'gulp-sync'
import del from 'del'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'

const sync = gulpSync(gulp).sync

console.log('Started in ', process.env.NODE_ENV, ' mode')
/**
 * client:build
 *
 * Builds the client code from src/client to dist/client
 * Uses webpack to compile the code.
 */
gulp.task('client:build', (done) => {
  webpack(webpackConfig).run(x => done())

  // Run both for server and client by changing the webpackconfig
  // accordingly

})

gulp.task('clean', () => del([`${process.env.DIST_PATH}/*`]))

/* client:dev */
gulp.task('client:dev', () => {
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
gulp.task('start:production', sync(['clean', 'client:build']))
gulp.task('start:development', ['client:dev'])
gulp.task('start:test')
