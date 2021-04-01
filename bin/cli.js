#!/usr/bin/env node
require('yargs/yargs')(process.argv.slice(2))
  .option('apiKey', {
    description: 'Your Ghost Inspector API key.',
  })
  .commandDir('commands')
  .demandCommand()
  .wrap(120)
  .help().argv
