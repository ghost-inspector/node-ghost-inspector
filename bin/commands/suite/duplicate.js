
const helpers = require('../../helpers')

module.exports = {
  command: 'duplicate <suite-id>',
  desc: 'Duplicate a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.duplicateSuite(argv.suiteId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}