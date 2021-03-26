
const helpers = require('../../helpers')

module.exports = {
  command: 'list <suite-id>',
  desc: 'Fetch an array of suite results for a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getSuiteResults(argv.suiteId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}