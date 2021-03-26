
const helpers = require('../../helpers')

module.exports = {
  command: 'list-results <test-id>',
  desc: 'Fetch an array containing the results for a test. Results are returned in reverse chronological order (newest first).',
  builder: (yargs) => {
    yargs.options({
      'count': {
        description: 'Number of results to return.',
        default: 10,
      },
      'offset': {
        description: 'Number of results to skip.',
        default: 0,
      }
    })
    return yargs
  },
  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)

    // pull out the testId & apiKey so the rest can be passed in verbatim
    const testId = args.testId
    delete args['testid']

    const apiKey = args.apiKey
    delete args['apiKey']

    try {
      const client = require('../../../index')(apiKey)
      const [result, passing, screenshotPassing] = await client.getTestResults(testId, args)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}