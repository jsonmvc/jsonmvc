
const resolve = require('rollup-plugin-node-resolve')
const alias = require('rollup-plugin-alias')
const commonjs = require('rollup-plugin-commonjs')
const builtins = require('rollup-plugin-node-builtins')
const nodeResolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const globals = require('rollup-plugin-node-globals')
const rollupGrapher = require('rollup-plugin-grapher')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')

module.exports = config => {
  let root = __dirname + '/packages/' + config.package

  return {
    input: root + '/src/index.js',
    plugins: [
      // uglify(),
      // rollupGrapher({
      //  dest: __dirname + '/../dist/build-graph.html'
      // }),
      nodeResolve({
        jsnext: true,
        main: true
      }),
      json(),
      alias({
        'vue': root + '/node_modules/vue/dist/vue.esm.js',
        'symbol-observable': root + '/node_modules/symbol-observable/es/index.js'
      }),
      babel({
        babelrc: false,
        exclude: root + '/node_modules/**',
        presets: [
          [
            'es2015',
            {
              modules: false
            }
          ]
        ],
        plugins: [
          'lodash',
          'external-helpers'
        ]
      }),
      commonjs({
        include: root + '/node_modules/**',
        namedExports: {
          'zen-observable': ['default']
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.NODE_UNIQUE_ID': JSON.stringify('0')
      }),
      builtins(),
      globals(),
      resolve()
    ],
    external: ['firebase', 'jsonmvc-helper-observer', 'jsonmvc-helper-guid'],
    file: root + '/dist/' + config.package + '.js',
    format: 'umd',
    name: config.package,
    globals: {
      firebase: 'firebase',
      'jsonmvc-helper-guid': 'jsonmvc-helper-guid'
    },
  //  external: ['lodash', 'lodash-es', 'setimmediate'],
    output: {
      file: root + '/dist/' + config.package + '.js',
      format: 'umd',
      name: config.package,
      sourcemap: true,
    }
  }
}
