'use strict'

const path = require('path')

const appPackageJson = path.resolve('package.json')
const appPackage = require(appPackageJson)
const root = path.resolve()

const clientDir = (appPackage.config && appPackage.config.clientDir) || ''

module.exports = {
  appPackageJson,
  appHtml: path.join(root, clientDir, 'index.html'),
  appSrc: path.join(root, clientDir, 'src'),
  appBuild: path.join(root, 'build'),
  appNodeModules: path.join(root, 'node_modules'),
  ownNodeModules: path.join(__dirname, '..', 'node_modules')
}
