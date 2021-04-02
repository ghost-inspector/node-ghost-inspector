const helpers = require('../../helpers')

module.exports = {
  command: 'get <test-id>',
  desc: 'Fetch a single test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getTest(argv.testId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
