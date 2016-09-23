/* eslint-disable global-require */
'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const url = require('url')
const paths = require('./paths')
const env = require('./env')

if (env['process.env.NODE_ENV'] !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

const homepagePath = require(paths.appPackageJson).homepage
let publicPath = homepagePath ? url.parse(homepagePath).pathname : '/'
if (!publicPath.endsWith('/')) publicPath += '/'

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    path.join(paths.appSrc, 'index'),
  ],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath,
  },
  resolve: {
    extensions: [ '.js', '.json', '' ],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
    },
  },
  resolveLoader: {
    root: paths.ownNodeModules,
    moduleTemplates: [ '*-loader' ],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          babelrc: false,
          presets: [ require.resolve('./babel-preset') ],
        },
      },
      {
        test: /\.css$/,
        include: [ paths.appNodeModules ],
        loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!postcss'),
      },
      {
        test: /\.css$/,
        include: [ paths.appSrc ],
        loader: ExtractTextPlugin.extract('style', [
          `css?${[
            '-autoprefixer',
            'sourceMap',
            'modules',
            'importLoaders=1',
            'localIdentName=[hash:base64:8]'
          ].join('&')}`,
          'postcss'
        ].join('!')),
      },
      {
        test: /\.json$/,
        include: [ paths.appSrc, paths.appNodeModules ],
        loader: 'json',
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        include: [ paths.appSrc, paths.appNodeModules ],
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\/favicon.ico$/,
        include: [ paths.appSrc ],
        loader: 'file',
        query: {
          name: 'favicon.ico?[hash:8]',
        },
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: [ paths.appSrc, paths.appNodeModules ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  postcss() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9',
        ],
      }),
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin(env),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false,
      },
      mangle: {
        screw_ie8: true, // eslint-disable-line camelcase
      },
      output: {
        comments: false,
        screw_ie8: true, // eslint-disable-line camelcase
      },
    }),
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
  ],
}
