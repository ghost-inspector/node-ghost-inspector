#!/usr/bin/env node
require('yargs/yargs')(process.argv.slice(2))
  .option('apiKey', {
    description: 'Your Ghost Inspector API key.',
    default: process.env.GHOST_INSPECTOR_API_KEY
  })
  .demandOption('apiKey')
  .commandDir('commands')
  .demandCommand()
  .help()
  .argv