const helpers = require('../../helpers')

module.exports = {
  command: 'duplicate <suite-id>',
  desc: 'Duplicate a suite.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.duplicateSuite(argv.suiteId)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Suite duplicated: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
