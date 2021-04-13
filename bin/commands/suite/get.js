const helpers = require('../../helpers')

module.exports = {
  command: 'get <suite-id>',
  desc: 'Fetch a single suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getSuite(argv.suiteId)
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
