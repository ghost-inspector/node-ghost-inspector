const helpers = require('../../helpers')

module.exports = {
  command: 'cancel <suiteResultId>',
  desc: 'Cancel an active suite run.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.cancelSuiteResult(argv.suiteResultId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Suite result cancelled: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
