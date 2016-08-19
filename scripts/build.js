'use strict'

process.env.NODE_ENV = 'production'

const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')
const paths = require('../config/paths')

function build() {
  rimrafSync(paths.appBuild + '/*')
  webpack(config).run((err, stats) => {
    if (err) {
      console.error(err.message || err)
      process.exit(1)
    }
  })
}

module.exports = build
