const helpers = require('../../helpers')

module.exports = {
  command: 'delete <testId>',
  desc: 'Delete a test.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.deleteTest(argv.testId)
    if (argv.json) {
      helpers.printJson({ deleted: result })
    } else {
      helpers.print({
        message: `Test deleted (${argv.testId})`,
      })
    }

    process.exit(0)
  },
}
