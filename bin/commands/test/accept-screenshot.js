
const helpers = require('../../helpers')

// TODO: test the errors (already accepted, no visuals, etc)
module.exports = {
  command: 'accept-screenshot <test-id>',
  desc: 'Accept the current screenshot as the new baseline for a test, will throw/return an error if the test\'s screenshot is already passing, or if screenshot comparison is disabled.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.acceptTestScreenshot(argv.testId)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}