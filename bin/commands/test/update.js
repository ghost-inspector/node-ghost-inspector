const helpers = require('../../helpers')

module.exports = {
  command: 'update <testId>',
  desc: 'Update a test.',
  builder: (yargs) => {
    yargs.options({
      '[attribute]': {
        description: 'Pass "--[attribute] value" to update your test (eg: --name "My test")',
      },
    })
    return yargs
  },
  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const testId = args.testId
    delete args['testId']

    const client = helpers.getClient(argv)
    const result = await client.updateTest(testId, args)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Test updated: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
