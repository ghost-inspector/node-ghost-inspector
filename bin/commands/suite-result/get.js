const helpers = require('../../helpers')

module.exports = {
  command: 'get <suite-result-id>',
  desc: 'Fetch a single suite result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getSuiteResult(argv.suiteResultId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
