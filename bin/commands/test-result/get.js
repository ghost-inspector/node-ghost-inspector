const helpers = require('../../helpers')

module.exports = {
  command: 'get <resultId>',
  desc: 'Fetch a single test result.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.getTestResult(argv.resultId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: result.name,
        id: result._id,
        passing: result.passing,
      })
    }

    process.exit(0)
  },
}
