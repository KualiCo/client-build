'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const combineLoaders = require('webpack-combine-loaders')
const paths = require('./paths')
const env = require('./env')
const pkg = require(paths.appPackageJson)

const dashboard = new Dashboard()

const modulesDirectories = ['node_modules']
  .concat(pkg.config && pkg.config.modulesDirectories)
  .filter(Boolean)

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
    path.join(paths.appSrc, 'index')
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/'
  },
  resolve: {
    modulesDirectories,
    extensions: ['.js', '.json', ''],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
    }
  },
  resolveLoader: {
    root: paths.ownNodeModules,
    moduleTemplates: ['*-loader']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: 'babel',
        query: require('./babel.dev')
      },
      {
        test: /\.css$/,
        include: [paths.appNodeModules],
        loader: 'style!css!postcss'
      },
      {
        test: /\.css$/,
        include: [paths.appSrc],
        loader: combineLoaders([
          {
            loader: 'style'
          },
          {
            loader: 'css',
            query: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:8]'
            }
          },
          {
            loader: 'postcss'
          }
        ])
      },
      {
        test: /\.json$/,
        include: [paths.appSrc, paths.appNodeModules],
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
        include: [paths.appSrc, paths.appNodeModules],
        exclude: /\/favicon.ico$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\/favicon.ico$/,
        include: [paths.appSrc],
        loader: 'file',
        query: {
          name: 'favicon.ico?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: [paths.appSrc, paths.appNodeModules],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss: () => [
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9',
      ]
    }),
  ],
  devServer: {
    proxy: pkg.config && pkg.config.proxy
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(dashboard.setData)
  ]
}
