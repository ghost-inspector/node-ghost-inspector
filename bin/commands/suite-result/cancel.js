const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <suite-result-id>',
  desc: 'Cancel an active suite run.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.cancelSuiteResult(argv.suiteResultId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}