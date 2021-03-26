
const helpers = require('../../helpers')

module.exports = {
  command: 'get <suite-result-id>',
  desc: 'Fetch a single suite result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getSuiteResult(argv.suiteResultId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}