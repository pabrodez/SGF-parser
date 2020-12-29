import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const input = './src/index.ts'

export default [
    {
        input: input,
        output: {
            format: 'esm',
            file: pkg.module,
            sourcemap: false,
        },
        plugins: [
            typescript()
        ]
    },
    {
        input: input,
        output: {
            format: 'cjs',
            file: pkg.main,
            sourcemap: false,
            exports: 'default'
        },
        plugins: [
            typescript()
        ]
    },
    {
        input: input,
        output: {
            format: 'umd',
            name: 'SgfParser',
            file: pkg.unpkg,
            sourcemap: false,
        },
        plugins: [
            // terser(),
            typescript()
        ]
    },

]