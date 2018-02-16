// import basic libraries
import webpack from 'webpack';
import path from 'path';

// import webpack plugins
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// define extraction plugin for styles
const extractStylePlugin = new ExtractTextPlugin({
    filename: "styles.[contenthash].css"
});

// define directory paths
const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
    entry: {
        'app': APP_DIR + '/index.ts'
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test: /\.(ts)$/,
                include: APP_DIR,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.scss$/,
                use: extractStylePlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].[hash].js',
            minChunks: module => /node_modules/.test(module.resource)
        }),
        new HtmlWebpackPlugin({
            title: 'Traze',
            filename: 'index.html',
            template: APP_DIR + '/html/index.ejs',
            chunks: ['app', 'vendor']
        }),
        new WebpackCleanupPlugin(),
        extractStylePlugin
    ],
    devServer: {
        contentBase: [BUILD_DIR],
        compress: true,
        port: 9009,
        watchContentBase: true
    }
};

export default config;
