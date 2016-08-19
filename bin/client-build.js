#!/usr/bin/env node
'use strict'

const program = require('commander')
const pkg = require('../package.json')

const VALID_SCRIPTS = [
  'build',
  'start'
]

program
  .version(pkg.version)
  .arguments('<cmd>')
  .action((cmd) => {
    if (VALID_SCRIPTS.indexOf(cmd) === -1) return program.help()
    require(`../scripts/${cmd}`)()
  })
  .parse(process.argv)
