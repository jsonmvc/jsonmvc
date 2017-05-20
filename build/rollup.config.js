
import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';

export default {
  entry: __dirname + '/../src/jsonmvc/index.js',
  format: 'iife',
  moduleName: 'jsonmvc',
  plugins: [
    alias({
      _vue: 'node_modules/vue/dist/vue.js',
      '@most/prelude': 'node_modules/@most/prelude/src/index.js'
    }),
    commonjs({
      namedExports: {
        'zen-observable': ['default' ] }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.NODE_UNIQUE_ID': JSON.stringify('0')
    }),
    builtins(),
    resolve()
  ],
  dest: __dirname + '/../dist/build.js'
}
