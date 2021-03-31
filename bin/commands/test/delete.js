const helpers = require('../../helpers')

module.exports = {
  command: 'delete <test-id>',
  desc: 'Delete a test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.deleteTest(argv.testId)
      helpers.print({ deleted: result })
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
