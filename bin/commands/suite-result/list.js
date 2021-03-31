const helpers = require('../../helpers')

module.exports = {
  command: 'list <suite-id>',
  desc: 'Fetch an array of suite results for a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getSuiteResults(argv.suiteId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
