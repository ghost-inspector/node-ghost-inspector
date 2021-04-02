const helpers = require('../../helpers')

module.exports = {
  command: 'get-results-running <test-id>',
  desc: 'Fetch a list of the currently-executing results for this test and return the result.',

  builder: {},

  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const results = await client.getTestResultsRunning(argv.testId)
      helpers.printJson(results)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
