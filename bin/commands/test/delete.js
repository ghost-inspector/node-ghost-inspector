
const helpers = require('../../helpers')

module.exports = {
  command: 'delete <test-id>',
  desc: 'Delete a test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.deleteTest(argv.testId)
      // TODO: test this, non-JSON response?
      console.log(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
  }
}