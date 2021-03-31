const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <suite-result-id>',
  desc: 'Cancel an active suite run.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.cancelSuiteResult(argv.suiteResultId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
