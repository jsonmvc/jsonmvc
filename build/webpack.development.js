import webpack from 'webpack'
import { Config } from 'webpack-config'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const envVars = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
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
      publicPath: process.env.BASE_PATH,
      pathinfo: true,
      library: process.env.LIBRARY_NAME,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    entry: {
      server: [
        `webpack-dev-server/client?http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
        'webpack/hot/dev-server'
      ],
      library: [
        process.env.SRC_ENTRY
      ],
      app: [
        process.env.APP_ENTRY
      ]
    },

    resolve: {
      alias: {
        'lib': `${process.env.CORE_PATH}/lib`,

        'controllers': `${process.env.CORE_PATH}/controllers`,
        'models': `${process.env.CORE_PATH}/models`,
        'views': `${process.env.CORE_PATH}/views`,

        'modules': process.env.MODULES_PATH,

        'vue': 'vue/dist/vue.common.js'

      },
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      new webpack.HotModuleReplacementPlugin(),
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
      preLoaders: [
        { test: /\.vue$/, exclude: exclude, loader: 'html'}
      ],
      loaders: [
        { test: /\.js$/, exclude: exclude, loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: [
              'lodash',
              'add-module-exports'
            ]
          }
        }
      ]
    }
  })

module.exports = conf
