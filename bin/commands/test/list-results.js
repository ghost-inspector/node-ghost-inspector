const helpers = require('../../helpers')

module.exports = {
  command: 'list-results <test-id>',
  desc:
    'Fetch an array containing the results for a test. Results are returned in reverse chronological order (newest first).',
  builder: (yargs) => {
    yargs.options({
      count: {
        description: 'Number of results to return.',
        default: 10,
      },
      offset: {
        description: 'Number of results to skip.',
        default: 0,
      },
    })
    return yargs
  },
  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const testId = args.testId
    delete args['testid']

    try {
      const client = require('../../../index')(argv.apiKey)
      const [result, passing, screenshotPassing] = await client.getTestResults(testId, args)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
