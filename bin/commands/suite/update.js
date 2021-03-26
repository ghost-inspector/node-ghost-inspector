
const helpers = require('../../helpers')

module.exports = {
  command: 'update <suite-id>',
  desc: 'Update a suite.',
  builder: (yargs) => {
    yargs.options({
      // TODO: list all possible values?
      '[attribute]': {
        description: 'Pass "--[attribute] value" to update your suite (eg: --name "My test")',
      },
    })
    return yargs
  },
  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)

    const testId = args.testId
    delete args['testId']

    const apiKey = args.apiKey
    delete args['apiKey']
    try {
      const client = require('../../../index')(apiKey)
      const result = await client.updateSuite(suiteId, args)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }
    process.exit(0)
  }
}