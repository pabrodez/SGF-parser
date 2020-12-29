const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'ts-sgf-parser.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SgfParser',
        libraryTarget: 'umd',
        libraryExport: 'default',  // we want the default export of the entry file to be imported as default
        umdNamedDefine: true, 
        globalObject: 'this',  // make UMD build available on both browser and Node
    },
    mode: 'production',
    // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }

};