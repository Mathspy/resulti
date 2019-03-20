import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = Object.keys(pkg.dependencies || {}).concat(
  Object.keys(pkg.peerDependencies || {})
);

const input = 'src/index.js';

export default [
  // ESM build
  {
    input,
    external,
    output: {
      file: pkg.module,
      format: 'esm',
    },
    // Default export magic
    plugins: [babel()],
  },
  // CommonJS build
  {
    input,
    external,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [babel()],
  },
  // UMD builds
  {
    input,
    external,
    output: {
      file: 'dist/resulti.dev.umd.js',
      format: 'umd',
      name: 'resulti',
    },
    plugins: [
      // Setting development env before running babel etc
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      babel(),
    ],
  },
  {
    input,
    external,
    output: {
      file: 'dist/resulti.prod.umd.js',
      format: 'umd',
      name: 'resulti',
    },
    plugins: [
      // Setting development env before running babel etc
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      babel(),
      terser(),
    ],
  },
];
