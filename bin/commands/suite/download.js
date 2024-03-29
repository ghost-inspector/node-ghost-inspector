const helpers = require('../../helpers')

module.exports = {
  command: 'download <suiteId>',
  desc: 'Download a single suite.',
  builder: (yargs) => {
    yargs.options({
      destination: {
        description: 'Path to local destination for output. Defaults to "suite-<suiteId>.zip"',
      },
      format: {
        description: 'Desired output format',
        choices: ['json', 'html', 'side'],
        default: 'json',
      },
      includeImports: {
        description:
          'Bundle imported suites in the export when provided (currenlty for .json exports only)',
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
        downloadMethod = 'downloadSuiteSeleniumHtml'
        break
      case 'side':
        downloadMethod = 'downloadSuiteSeleniumSide'
        break
      default:
        downloadMethod = 'downloadSuiteJson'
    }

    let destination
    if (args.destination) {
      destination = `${args.destination}.zip`
    } else {
      destination = `suite-${args.suiteId}.zip`
    }

    await client[downloadMethod](args.suiteId, destination, {
      includeImports: !!args.includeImports,
    })
    console.log(`Suite downloaded to ${destination}`)

    process.exit(0)
  },
}
