const helpers = require('../../helpers')

module.exports = {
  command: 'get-running <organization-id>',
  desc:
    'Fetch a list of the currently-executing results for the entire organization and return the results.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getAllRunningTests(argv.organizationId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
