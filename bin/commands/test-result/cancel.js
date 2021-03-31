const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <result-id>',
  desc: 'Cancel an active test run.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.cancelTestResult(argv.resultId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
