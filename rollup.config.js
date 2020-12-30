import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
    input: './src/ts-sgf-parser.ts',

    output: [
        {
            format: 'esm',
            file: pkg.module,
        },
        {
            format: 'umd',
            file: pkg.main,
            name: 'SgfParser'
        }
    ],
    plugins: [typescript()]
}
