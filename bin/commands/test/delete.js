const helpers = require('../../helpers')

module.exports = {
  command: 'delete <test-id>',
  desc: 'Delete a test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.deleteTest(argv.testId)
      helpers.printJson({ deleted: result })
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
