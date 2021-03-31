const helpers = require('../../helpers')

module.exports = {
  command: 'get <suite-id>',
  desc: 'Fetch a single suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getSuite(argv.suiteId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
