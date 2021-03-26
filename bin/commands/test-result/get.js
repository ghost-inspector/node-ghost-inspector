
const helpers = require('../../helpers')

module.exports = {
  command: 'get <test-result-id>',
  desc: 'Fetch a single test result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getTestResult(argv.testResultId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}