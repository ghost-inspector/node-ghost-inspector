const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <result-id>',
  desc: 'Cancel an active test run.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.cancelTestResult(argv.resultId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}