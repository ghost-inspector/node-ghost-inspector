const helpers = require('../../helpers')

module.exports = {
  command: 'create <organization-id> <suite-name>',
  desc: 'Create a suite.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.createSuite(argv.organizationId, argv.suiteName)
      helpers.print(result)
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
