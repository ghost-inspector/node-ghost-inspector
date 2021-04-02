const helpers = require('../../helpers')

module.exports = {
  command: 'duplicate <suite-id>',
  desc: 'Duplicate a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.duplicateSuite(argv.suiteId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
