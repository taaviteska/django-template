const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');


const filenameTemplate = process.env.NODE_ENV === 'production' ? '.[hash]' : '';
const extractCSS = new ExtractTextPlugin('[name]' + filenameTemplate + '.css');

module.exports = {
    entry: {
        main: ['babel-polyfill', './src/js/main.js'],
        bootstrap: 'bootstrap-loader'
    },
    output: {
        path: './public/',
        filename: 'bundle' + filenameTemplate + '.js',
        library: '{{ cookiecutter.repo_name }}'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: /src\/js\//,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: extractCSS.extract('style', ['css?sourceMap', 'resolve-url', 'sass?sourceMap'])
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        extractCSS,
        new BundleTracker({filename: './public/webpack-stats.json'})
    ],
    sassLoader: {
        outputStyle: "compressed"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
