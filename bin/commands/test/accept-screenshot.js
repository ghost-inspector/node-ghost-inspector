const helpers = require('../../helpers')

module.exports = {
  command: 'accept-screenshot <test-id>',
  desc:
    "Accept the current screenshot as the new baseline for a test, will throw/return an error if the test's screenshot is already passing, or if screenshot comparison is disabled.",
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.acceptTestScreenshot(argv.testId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
