import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import monaco from "rollup-plugin-monaco-editor";

export default {
  input: 'src/pb-discept.js',
  output: {
    file: 'dist/pb-discept.js',
    format: 'esm',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    postcss(),
    monaco(),
  ],
  external: [
    'lit-element',
    'lit-html/directives/unsafe-html.js',
    'monaco-editor',
    '@teipublisher/pb-components/src/pb-mixin.js',
  ],
};
