'use strict'

const path = require('path')
const Mocha = require('mocha')
const globby = require('globby')
const paths = require('../config/paths')
const mochaConfig = require('../config/mocha')
const babelConfig = require('../config/babel.dev')

function test() {
  const mocha = new Mocha(mochaConfig)
  setup()
  globby.sync(paths.tests)
    .filter((filepath) => path.extname(filepath) === '.js')
    .forEach((testFile) => mocha.addFile(testFile))
  paths.testSetup
    .forEach((setupFile) => {
      /* eslint-disable no-console */
      try {
        require(setupFile) // eslint-disable-line global-require
      } catch (err) {
        console.error(`failed to load setup file: ${setupFile}`)
        console.error(err.message)
      }
    })

  mocha.run((code) => process.exit(code)) // eslint-disable-line no-process-exit
}

function setup() {
  /* eslint-disable global-require */
  require('babel-register')(babelConfig)
  require('css-modules-require-hook')({
    generateScopedName: '[name]__[local]___[hash:base64:5]',
  })
  require('asset-require-hook')({
    extensions: 'ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2'.split('|'),
    name: 'static/media/[name].[hash:8].[ext]',
  })
  require('asset-require-hook')({
    extensions: 'mp4|webm'.split('|'),
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]',
  })

  const jsdom = require('jsdom').jsdom
  const exposedProperties = [ 'window', 'navigator', 'document' ]
  global.document = jsdom('')
  global.window = global.document.defaultView
  Object.keys(global.document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property)
      global[property] = global.document.defaultView[property]
    }
  })
  global.navigator = {
    userAgent: 'node.js',
  }
  global.documentRef = global.document
}

module.exports = test
