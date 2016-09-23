'use strict'

process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')
const meta = require('../config/meta')
const paths = require('../config/paths')
const config = require('../config/webpack.dev')

function setupCompiler(webpackConfig) {
  const compiler = webpack(webpackConfig)
  return compiler
}

function runDevServer(port) {
  const compiler = setupCompiler(config)
  const devServer = new WebpackDevServer(compiler, {
    contentBase: paths.clientDir,
    publicPath: config.output.publicPath,
    hot: true,
    stats: { colors: true },
    quiet: meta.dashboard,
    historyApiFallback: true,
    proxy: meta.proxy,
  })
  devServer.listen(port)
}

function start() {
  runDevServer(meta.port)
  opn(`http://localhost:${meta.port}`)
}

module.exports = start
