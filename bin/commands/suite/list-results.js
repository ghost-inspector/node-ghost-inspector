
const helpers = require('../../helpers')

module.exports = {
  command: 'list-results <suite-id>',
  desc: 'Fetch an array containing the results for a suite. Results are returned in reverse chronological order (newest first).',
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
    // TODO: output CSV format? Node client doesn't have it yet
    return yargs
  },
  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)

    // pull out the suiteId & apiKey so the rest can be passed in verbatim
    const suiteId = args.suiteId
    delete args['suiteid']

    const apiKey = args.apiKey
    delete args['apiKey']

    try {
      const client = require('../../../index')(apiKey)
      const results = await client.getSuiteResults(suiteId, args)
      helpers.print(results)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}