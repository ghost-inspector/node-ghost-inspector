const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <resultId>',
  desc: 'Cancel an active test run.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.cancelTestResult(argv.resultId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Result cancelled: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
