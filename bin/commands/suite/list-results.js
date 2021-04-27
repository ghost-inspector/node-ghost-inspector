const helpers = require('../../helpers')

module.exports = {
  command: 'list-results <suiteId>',
  desc:
    'Fetch an array containing the results for a suite. Results are returned in reverse chronological order (newest first).',
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

    // pull out the suiteId & apiKey so the rest can be passed in verbatim
    const suiteId = args.suiteId
    delete args.suiteId

    const client = helpers.getClient(argv)
    const results = await client.getSuiteResults(suiteId, args)
    if (argv.json) {
      helpers.printJson(results)
    } else {
      results.forEach((item) => {
        helpers.print({
          message: item.name,
          id: item._id,
          passing: item.passing,
        })
      })
    }

    process.exit(0)
  },
}
