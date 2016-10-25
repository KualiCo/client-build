/* eslint-disable global-require */
'use strict'

const url = require('url')
const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const findCacheDir = require('find-cache-dir')
const meta = require('./meta')
const paths = require('./paths')
const env = require('./env')

const modulesDirectories = [ 'node_modules' ]
  .concat(meta.modulesDirectories)
  .filter(Boolean)

const homepagePath = require(paths.appPackageJson).homepage
let publicPath = homepagePath ? url.parse(homepagePath).pathname : '/'
if (!publicPath.endsWith('/')) publicPath += '/'

module.exports = {
  devtool: 'eval',
  entry: [
    `${require.resolve('webpack-dev-server/client')}?/`,
    require.resolve('webpack/hot/dev-server'),
    require.resolve('./polyfills'),
    path.join(paths.appSrc, 'index'),
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath,
  },
  resolve: {
    modulesDirectories,
    extensions: [ '.js', '.json', '' ],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
      'react-native': 'react-native-web',
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
          cacheDirectory: findCacheDir({
            name: 'client-build',
          }),
        },
      },
      {
        test: /\.css$/,
        include: [ paths.appNodeModules ],
        loader: 'style!css?-autoprefixer!postcss',
      },
      {
        test: /\.css$/,
        include: [ paths.appSrc ],
        loader: [
          'style',
          `css?${[
            'sourceMap',
            'modules',
            'importLoaders=1',
            'localIdentName=[name]__[local]___[hash:base64:5]'
          ].join('&')}`,
          'postcss',
        ].join('!'),
      },
      {
        test: /\.json$/,
        include: [ paths.appSrc, paths.appNodeModules ],
        loader: 'json',
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
        include: [ paths.appSrc, paths.appNodeModules ],
        exclude: /\/favicon.ico$/,
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
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

if (meta.dashboard) {
  const dashboard = new Dashboard()
  module.exports.plugins.push(new DashboardPlugin(dashboard.setData))
}
