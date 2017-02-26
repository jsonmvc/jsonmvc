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
    entry: `${process.env.TEST_PATH}/tests/unit.js`,
    output: {
      path: `${process.env.ROOT_PATH}/dist`,
      filename: 'bundle.js'
    },
    target: 'node'
  })
