const helpers = require('../../helpers')

module.exports = {
  command: 'update <suiteId>',
  desc: 'Update a suite.',
  builder: (yargs) => {
    yargs.options({
      '[attribute]': {
        description: 'Pass "--[attribute] value" to update your suite (eg: --name "My test")',
      },
    })
    return yargs
  },
  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const suiteId = args.suiteId
    delete args.suiteId

    const client = helpers.getClient(argv)
    const result = await client.updateSuite(suiteId, args)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Suite updated: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
