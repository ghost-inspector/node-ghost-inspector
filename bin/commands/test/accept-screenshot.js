const helpers = require('../../helpers')

module.exports = {
  command: 'accept-screenshot <testId>',
  desc:
    "Accept the current screenshot as the new baseline for a test, will throw/return an error if the test's screenshot is already passing, or if screenshot comparison is disabled.",
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.acceptTestScreenshot(argv.testId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Screenshot accepted: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
