const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require ('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const useDevServer = false;
const publicPath = useDevServer ? 'http://localhost:8080/build/' : '/build/';
const isProduction = process.env.NODE_ENV === 'production';
const useSourcemaps = !isProduction;

const styleLoader = {
    loader: 'style-loader',
    options: {
        sourceMap: useSourcemaps
    }
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: useSourcemaps,
        minimize: isProduction
    }
};

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true
    }
};

const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: useSourcemaps
    }
};

const webpackConfig = {
    entry: {
        rep_log : './assets/js/rep_log.js',
        login : './assets/js/login.js',
        layout : './assets/js/layout.js'
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build'),
        filename: "[name].js",
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        cssLoader
                    ],
                    fallback: styleLoader
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        cssLoader,
                        resolveUrlLoader,
                        sassLoader
                    ],
                    fallback: styleLoader
                })
            },

            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash:6].[ext]'
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash:6].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery : 'jquery',
            $ : 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CopyWebpackPlugin([
            //copies to {output}/static
            { from: './assets/static', to: 'static'}
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'layout',
                'manifest'
            ],
            minChunks: Infinity
        }),
        new ExtractTextPlugin('[name].css'),
    ],
    devtool: useSourcemaps ? 'inline-source-map' : false,
    devServer: {
        contentBase: './web',
        headers: { 'Access-Control-Allow-Origin': '*' },
    }
};

if(isProduction) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );

    webpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    );

    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    );
}

module.exports = webpackConfig;