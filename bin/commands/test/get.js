
const helpers = require('../../helpers')

module.exports = {
  command: 'get <test-id>',
  desc: 'Fetch a single test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getTest(argv.testId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}