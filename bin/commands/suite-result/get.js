const helpers = require('../../helpers')

module.exports = {
  command: 'get <suite-result-id>',
  desc: 'Fetch a single suite result.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.getSuiteResult(argv.suiteResultId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: result.name,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
