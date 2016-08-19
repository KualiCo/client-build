'use strict'

process.env.NODE_ENV = 'production'

const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const chalk = require('chalk')
const config = require('../config/webpack.config.prod')
const paths = require('../config/paths')

function build() {
  rimrafSync(paths.appBuild + '/*')
  webpack(config).run((err, stats) => {
    if (err) {
      console.error(err.message || err)
      process.exit(1)
    }
    onFinished(stats)
  })
}

const SYNTAX_ERROR_LABEL = 'Syntax error:';
function isSyntaxError(message) {
  return message.indexOf(SYNTAX_ERROR_LABEL) !== -1;
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

function onFinished(stats) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();

  const json = stats.toJson({}, true);
  const formattedErrors = json.errors
    .map((message) => `Error in ${formatMessage(message)}`)
    .filter(isSyntaxError)
  const formattedWarnings = json.warnings
    .map((message) => `Warning in ${formatMessage(message)}`)

  if (hasErrors) {
    console.log(chalk.red('Failed to compile.\n'))
    formattedErrors.forEach((message) => console.log(`${message}\n`))
    return
  }
  if (hasWarnings) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    formattedWarnings.forEach((message) => console.log(`${message}\n`))
    return
  }

  console.log(chalk.green('Compiled successfully!'))
}

module.exports = build
