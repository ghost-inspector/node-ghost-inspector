const helpers = require('../../helpers')

module.exports = {
  command: 'get-results-running <test-id>',
  desc: 'Fetch a list of the currently-executing results for this test and return the result.',

  builder: {},

  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getTestResultsRunning(argv.testId)
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
