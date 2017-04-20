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
    devtool: '#inline-eval-cheap-source-map',
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
      app: [
        process.env.APP_ENTRY
      ],
      vendors: [
        'most',
        'vue',
        'zen-observable',
        'lodash',
        'jsonmvc-db',
        '@fdaciuk/ajax',
        'shortid',
        'firebase'
      ]
    },

    resolve: {
      alias: {

        '_lib': process.env.LIB_PATH,
        '_libs': process.env.LIBS_PATH,

        '_modules': process.env.MODULES_PATH,
        '_module': process.env.MODULE_PATH,

        '_controllers': `${process.env.CORE_PATH}/controllers`,
        '_models': `${process.env.CORE_PATH}/models`,
        '_views': `${process.env.CORE_PATH}/views`,
        '_fns': `${process.env.CORE_PATH}/fns`,

        '_vue': 'vue/dist/vue.common.js',

        '_utils': `${process.env.UTILS_PATH}/index`

      },
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
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
      watchOptions: {
        aggregateTimeout: 100
      }
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
              'add-module-exports',
              'transform-pug-html'
            ]
          }
        }
      ]
    }
  })

module.exports = conf
