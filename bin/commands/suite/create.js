const helpers = require('../../helpers')

module.exports = {
  command: 'create <organization-id> <suite-name>',
  desc: 'Create a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.createSuite(argv.organizationId, argv.suiteName)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Suite created: ${result.name}`,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
