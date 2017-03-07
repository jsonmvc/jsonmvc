import webpack from 'webpack'
import { Config } from 'webpack-config'
import path from 'path'
import fs from 'fs'

let nodeModules = {}
fs.readdirSync(`${process.env.ROOT_PATH}/node_modules`)
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  });

module.exports = new Config()
  .extend({
    './webpack.development.js': function (config) {
      delete config.output
      delete config.entry
      delete config.devServer
      delete config.plugins
      return config
    }
  })
  .merge({
    target: 'node',
    output: {
      path: process.env.DIST_NODE_PATH,
      filename: process.env.LIBRARY_NODE_FILE
    },
    entry: process.env.SRC_ENTRY,
    externals: nodeModules,
    plugins: [
      new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false })
    ],
    devtool: 'sourcemap'
  })
