'use strict'

const path = require('path')
const meta = require('./meta')

const appResolve = path.resolve.bind(path, meta.appDir)
const selfResolve = path.resolve.bind(path, __dirname, '..')

module.exports = {
  appBuild: appResolve(meta.build),
  appHtml: appResolve(meta.html),
  appPackageJson: appResolve(meta.packageJson),
  appSrc: appResolve(meta.src),
  tests: arrifyPrefix(meta.tests, meta.src),
  testSetup: arrifyPrefix(meta.testSetup, ''),
  appNodeModules: appResolve('node_modules'),
  ownNodeModules: selfResolve('node_modules'),
}

function arrifyPrefix(vals, prefix) {
  return [].concat(vals).map((val) => appResolve(prefix, val))
}
