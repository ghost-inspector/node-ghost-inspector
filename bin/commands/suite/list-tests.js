const helpers = require('../../helpers')

module.exports = {
  command: 'list-tests <suite-id>',
  desc: 'Fetch an array of all the tests in a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getSuiteTests(argv.suiteId)
      // print out result, regardless
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
