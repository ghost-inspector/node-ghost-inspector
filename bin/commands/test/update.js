const helpers = require('../../helpers')

module.exports = {
  command: 'update <test-id>',
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

    try {
      const client = helpers.getClient(argv)
      const result = await client.updateTest(testId, args)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
