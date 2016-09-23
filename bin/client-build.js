#!/usr/bin/env node
/* eslint-disable global-require */
'use strict'

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)

program
  .command('build')
  .description('Run a production client build')
  .action(() => require('../scripts/build')())

program
  .command('start')
  .description('Run the development watcher for your client assets')
  .action(() => require('../scripts/start')())

program
  .command('test')
  .description('Run the client tests')
  .action(() => require('../scripts/test')())

program
  .command('help')
  .description('Display command usage')
  .action(() => program.help())

program.parse(process.argv)

if (!program.args.length) program.help()
