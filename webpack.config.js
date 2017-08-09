module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'dist/index.js',
        path: __dirname,
        library: 'VisualforceHtmlPlugin',
        libraryTarget: 'umd'
    },
    node: {
        __filename: true,
        __dirname: true
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};