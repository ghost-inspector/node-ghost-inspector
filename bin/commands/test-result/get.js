
const helpers = require('../../helpers')

module.exports = {
  command: 'get <result-id>',
  desc: 'Fetch a single test result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getTestResult(argv.resultId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}