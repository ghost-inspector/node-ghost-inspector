const helpers = require('../../helpers')

module.exports = {
  command: 'duplicate <test-id>',
  desc: 'Duplicate a test.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.duplicateTest(argv.testId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Test duplicated: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
