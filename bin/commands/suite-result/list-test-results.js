const helpers = require('../../helpers')

module.exports = {
  command: 'list-test-results <suite-result-id>',
  desc:
    'Fetch an array containing the test results in a suite result. Results are returned in the order they were created when the suite was triggered (typically alphabetical order by test name).',
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

    const suiteResultId = args.suiteResultId
    delete args['suiteResultId']
    try {
      const client = require('../../../index')(argv.apiKey)
      const results = await client.getSuiteResultTestResults(suiteResultId, args)
      helpers.print(results)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
