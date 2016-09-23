/* eslint-disable no-console, no-process-exit */
'use strict'

process.env.NODE_ENV = 'production'

const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const chalk = require('chalk')
const bytes = require('bytes')
const config = require('../config/webpack.prod')
const paths = require('../config/paths')

function build() {
  rimrafSync(`${paths.appBuild}/*`)
  webpack(config).run((err, stats) => {
    if (err) {
      console.error(err.message || err)
      process.exit(1)
    }
    onFinished(stats)
  })
}

const SYNTAX_ERROR_LABEL = 'Syntax error:'
function isSyntaxError(message) {
  return message.indexOf(SYNTAX_ERROR_LABEL) !== -1
}
function formatMessage(message) {
  return message
    .replace('Module build failed: SyntaxError:', SYNTAX_ERROR_LABEL)
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '')
}

function parseStats(stats) {
  const json = stats.toJson({}, true)
  const formattedErrors = json.errors
    .map((message) => `Error in ${formatMessage(message)}`)
    .filter(isSyntaxError)
  const formattedWarnings = json.warnings
    .map((message) => `Warning in ${formatMessage(message)}`)

  return {
    hasErrors: stats.hasErrors(),
    hasWarnings: stats.hasWarnings(),
    errors: formattedErrors,
    warnings: formattedWarnings,
    assets: json.assets,
    chunks: json.chunks,
  }
}

function onFinished(stats) {
  stats = parseStats(stats)

  if (stats.hasErrors) {
    console.log(chalk.red('Failed to compile.\n'))
    return stats.errors.forEach((message) => console.log(`${message}\n`))
  }
  if (stats.hasWarnings) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    return stats.warnings.forEach((message) => console.log(`${message}\n`))
  }

  console.log(chalk.green('\n Compiled successfully!\n'))

  const appSize = stats.assets
    .sort((a, b) => b.size - a.size)
    .filter((asset) => !(/\.map$/).test(asset.name))
    .reduce((total, asset) => {
      console.log(`  ${bytes(asset.size)} -> ${asset.name} \n`)
      return total + asset.size
    }, 0)
  return console.log(
    '\n',
    chalk.bold.underline(`Total app size: ${bytes(appSize)}\n`)
  )
}

module.exports = build
