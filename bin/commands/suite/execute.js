const helpers = require('../../helpers')

module.exports = {
  command: 'execute <suite-id> [options]',
  desc: 'Execute a suite with the provided options.',

  builder: (yargs) => {
    yargs.options({
      ...helpers.getCommonExecutionOptions(),
    })
    return yargs
  },

  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    // pull out the suiteId & apiKey so the rest can be passed in verbatim
    const suiteId = args.suiteId
    delete args['suiteId']

    // execute
    try {
      const client = helpers.getClient(argv)
      const [result, passing, screenshotPassing] = await client.executeSuite(suiteId, args)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Suite result: ${result.name}`,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
