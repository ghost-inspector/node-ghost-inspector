const helpers = require('../../helpers')

module.exports = {
  command: 'list-tests <suite-id>',
  desc: 'Fetch an array of all the tests in a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getSuiteTests(argv.suiteId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
