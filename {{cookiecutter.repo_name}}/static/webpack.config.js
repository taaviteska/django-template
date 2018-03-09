const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');


const staticRoot = __dirname;
const srcRoot = path.resolve(staticRoot, 'src');
const publicRoot = path.resolve(staticRoot, 'public');

const filenameTemplate = process.env.NODE_ENV === 'production' ? '.[hash]' : '';
const extractCSS = new ExtractTextPlugin({
    filename: `[name]${filenameTemplate}.css`,
});
const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
    }),
    extractCSS,
    new BundleTracker({
        path: publicRoot,
        filename: 'webpack-stats.json',
        indent: 2,
        logTime: true,
    }),
];
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
    );
}

module.exports = {
    entry: {
        bootstrap: ['babel-polyfill', path.resolve(srcRoot, 'js/bootstrap.js')],
        styles: ['babel-polyfill', path.resolve(srcRoot, 'js/styles.js')],
        main: ['babel-polyfill', path.resolve(srcRoot, 'js/main.js')],
    },
    output: {
        path: publicRoot,
        filename: `[name]${filenameTemplate}.js`,
        library: '{{ cookiecutter.repo_name }}',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: /src\/js\//,
            },
            {
                test: /\.scss$/,
                loader: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true, minimize: true },
                        },
                        {
                            loader: 'postcss-loader',
                            options: { plugins: () => [autoprefixer], sourceMap: true },
                        },
                        {
                            loader: 'resolve-url-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true },
                        },
                    ],
                }),
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000',
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins,
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    // TODO: We might want to use eval-source-map in development, but couldn't get the CSS sourcemaps to work
    devtool: 'source-map',
};
