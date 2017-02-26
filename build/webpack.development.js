import webpack from 'webpack'
import { Config } from 'webpack-config'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const envVars = {
  NODE_ENV: `"${process.env.NODE_ENV}"`
}

const exclude = /node_modules/

const conf = new Config()
  .extend('./webpack.base.js')
  .merge({
    node: {
      fs: 'empty'
    },
    filename: __filename,
    debug: true,
    devtool: '#source-map',
    output: {
      path: process.env.DIST_PATH,
      pathinfo: true,
      publicPath: process.env.BASE_PATH
    },
    entry: {
      server: [
        `webpack-dev-server/client?http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
        'webpack/hot/dev-server'
      ],
      app: [
         process.env.SRC_ENTRY
      ],
      vendor: [
      ]
    },

    resolve: {
      alias: {
        'lib': process.env.LIB_PATH,

        'controllers': `${process.env.SRC_PATH}/controllers`,
        'models': `${process.env.SRC_PATH}/models`,
        'views': `${process.env.SRC_PATH}/views`

      },
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      new HtmlWebpackPlugin({
        inject: false,
        template: `${process.env.APP_PATH}/assets/index.ejs`,
        mobile: true,
        baseHref: process.env.HOST_IP,
        appMountId: process.env.ROOT_ELEMENT,
        devServer: process.env.NODE_ENV === 'development' ? `http://${process.env.HOST_IP}:${process.env.HOST_PORT}` : undefined,
        title: process.env.APP_TITLE,
        hash: true
      })
    ],
    devServer: {
      historyApiFallback: true,
      contentBase: `${process.env.APP_PATH}`,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      port: process.env.HOST_PORT,
      host: process.env.HOST_IP,
    },
    module: {
      noParse: [
      ],
      loaders: [
        { test: /\.js$/, exclude: exclude, loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: []
          }
        }
      ]
    }
  })

module.exports = conf
