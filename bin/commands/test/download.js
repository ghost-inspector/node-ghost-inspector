const helpers = require('../../helpers')

module.exports = {
  command: 'download <testId>',
  desc: 'Download a single test.',
  builder: (yargs) => {
    yargs.options({
      destination: {
        description: 'Path to local destination for output. Defaults to "test-<testId>.<format>"',
      },
      format: {
        description: 'Desired output format',
        choices: ['json', 'html', 'side'],
        default: 'json',
      },
      'include-imports': {
        description:
          'Bundle imported tests in the export when provided (currenlty for .json exports only)',
        type: 'boolean',
        default: false,
      },
    })
    return yargs
  },
  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)
    const client = helpers.getClient(argv)

    let downloadMethod
    switch (args.format) {
      case 'html':
        downloadMethod = 'downloadTestSeleniumHtml'
        break
      case 'side':
        downloadMethod = 'downloadTestSeleniumSide'
        break
      default:
        downloadMethod = 'downloadTestJson'
    }

    let destination
    if (args.destination) {
      destination = `${args.destination}.${args.format}`
    } else {
      destination = `test-${args.testId}.${args.format}`
    }

    await client[downloadMethod](args.testId, destination, {
      includeImports: !!args.includeImports,
    })
    // just print out the raw result, might not be JSON
    console.log(`Test downloaded to ${destination}`)

    process.exit(0)
  },
}
