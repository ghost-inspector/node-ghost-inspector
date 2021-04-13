const helpers = require('../../helpers')

module.exports = {
  command: 'get <test-id>',
  desc: 'Fetch a single test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getTest(argv.testId)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: result.name,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
