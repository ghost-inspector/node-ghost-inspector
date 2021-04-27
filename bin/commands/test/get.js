const helpers = require('../../helpers')

module.exports = {
  command: 'get <testId>',
  desc: 'Fetch a single test.',
  builder: {},
  handler: async function (argv) {
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

    process.exit(0)
  },
}
