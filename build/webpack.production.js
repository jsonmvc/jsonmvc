import webpack from 'webpack'
import { Config } from 'webpack-config'

module.exports = new Config()
  .extend({
    './webpack.development.js': function(config) {
      delete config.debug
      delete config.devtool
      delete config.output.pathinfo
      delete config.devServer
      delete config.entry.server
      return config;
    }
  })
  .merge({
    filename: __filename,
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      })
    ]
  })
