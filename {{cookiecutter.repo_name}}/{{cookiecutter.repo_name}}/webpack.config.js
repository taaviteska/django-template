const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');


const filenameTemplate = process.env.NODE_ENV === 'production' ? '.[hash]' : '';
const extractCSS = new ExtractTextPlugin('[name]' + filenameTemplate + '.css');

module.exports = {
    entry: {
        main: './static/js/main.js',
        bootstrap: 'bootstrap-loader'
    },
    output: {
        path: 'static/public/',
        filename: 'bundle' + filenameTemplate + '.js'
    },
    module: {
        loaders: [
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
        extractCSS,
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    sassLoader: {
        outputStyle: "compressed"
    }
};
