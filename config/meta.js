'use strict'

const path = require('path')

const appDir = path.resolve()
const appPackageJsonPath = path.resolve(appDir, 'package.json')
const appPackageJson = require(appPackageJsonPath)

module.exports = Object.assign(
  {
    build: 'build',
    html: 'index.html',
    src: 'src',
    tests: [
      '**/__tests__/*.js',
      '**/*.spec.js',
      '**/*.test.js',
    ],
    modulesDirectories: null,
    testSetup: 'test/setup',
    dashboard: true,
    proxy: null,
    port: 8080,
  },
  appPackageJson.clientBuild,
  {
    appDir,
    packageJson: 'package.json',
  }
)
