const helpers = require('../../helpers')

module.exports = {
  command: 'duplicate <test-id>',
  desc: 'Duplicate a test.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.duplicateTest(argv.testId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
