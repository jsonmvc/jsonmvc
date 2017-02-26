import path from 'path'
import { Config } from 'webpack-config'
import webpack from 'webpack'

//const exclude = /node_modules/
const exclude = //

module.exports = new Config().merge({
  output: {
    filename: '[name].js'
  },
  resolve: {
    root: [
      process.env.SRC_PATH
    ],
    modulesDirectories: [
      'node_modules'
    ]
  },
  module: {
    preLoaders: [
      { test: /\.yml|\.yaml$/, exclude: exclude, loader: 'json-loader!yaml-loader' },
      { test: /\.json$/, exclude: exclude, loader: 'json-loader' },
      { test: /\.html$/, loader: 'html', query: { minimize: true } }
    ]
  }
})
