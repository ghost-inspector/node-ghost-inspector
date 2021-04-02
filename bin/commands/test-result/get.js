const helpers = require('../../helpers')

module.exports = {
  command: 'get <result-id>',
  desc: 'Fetch a single test result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getTestResult(argv.resultId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
