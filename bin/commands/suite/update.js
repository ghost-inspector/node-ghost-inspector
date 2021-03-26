
const helpers = require('../../helpers')

module.exports = {
  command: 'update <suite-id> <suite-name>',
  desc: 'Update a suite with new <suite-name>.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.updateSuite(argv.suiteId, argv.suiteName)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }
    process.exit(0)
  }
}