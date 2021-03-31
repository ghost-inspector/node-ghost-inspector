const helpers = require('../../helpers')

module.exports = {
  command: 'get-results-running <test-id>',
  desc: 'Fetch a list of the currently-executing results for this test and return the result.',

  builder: {},

  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const results = await client.getTestResultsRunning(argv.testId)
      helpers.print(results)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
