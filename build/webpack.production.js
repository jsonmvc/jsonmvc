import webpack from 'webpack'
import { Config } from 'webpack-config'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

module.exports = new Config()
  .extend({
    './webpack.development.js': function(config) {
      delete config.debug
      // delete config.devtool
      delete config.output.pathinfo
      delete config.devServer
      delete config.entry.server
      config.plugins.splice(1, 3)
      delete config.entry.app
      config.entry[process.env.LIBRARY_NAME] = process.env.SRC_ENTRY
      return config
    }
  })
  .merge({
    filename: __filename,
    output: {
      path: process.env.DIST_BROWSER_PATH,
      filename: process.env.LIBRARY_FILE
    },
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
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: process.env.BUILD_REPORT_PATH,
        generateStatsFile: true,
        statsFilename: process.env.BUILD_STATS_PATH,
        statsOptions: null,
        logLevel: 'info'
      })
    ]
  })
