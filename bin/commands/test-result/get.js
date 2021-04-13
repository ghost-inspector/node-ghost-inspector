const helpers = require('../../helpers')

module.exports = {
  command: 'get <result-id>',
  desc: 'Fetch a single test result.',
  builder: {},
  handler: async function (argv) {
    try {
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
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
