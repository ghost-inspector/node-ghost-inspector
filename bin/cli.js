#!/usr/bin/env node

// mute spec when not under test
global.describe = () => {}

/* eslint-disable no-unused-expressions */
require('yargs/yargs')(process.argv.slice(2))
  .parserConfiguration({
    'camel-case-expansion': false,
  })
  .option('apiKey', {
    description:
      'Your Ghost Inspector API key. You may also pass GHOST_INSPECTOR_API_KEY through your environment.',
  })
  .option('json', {
    description: 'Provide output in JSON format.',
  })
  .commandDir('commands')
  .demandCommand()
  .wrap(120)
  .help().argv
