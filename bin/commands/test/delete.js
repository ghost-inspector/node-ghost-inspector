const helpers = require('../../helpers')

module.exports = {
  command: 'delete <test-id>',
  desc: 'Delete a test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.deleteTest(argv.testId)
      if (argv.json) {
        helpers.printJson({ deleted: result })
      } else {
        helpers.print({
          message: `Test deleted (${argv.testId})`,
        })
      }
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
