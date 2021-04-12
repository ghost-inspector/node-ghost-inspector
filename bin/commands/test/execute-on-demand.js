const helpers = require('../../helpers')

module.exports = {
  command: 'execute-on-demand <organization-id> <file> [options]',
  desc:
    'Execute an on-demand test against your organization providing the path to your local JSON <file>.',

  builder: (yargs) => {
    yargs.options({
      immediate: {
        description: 'Initiate the execution, then immediate return a response when provided',
        type: 'boolean',
        default: false,
      },
    })
    return yargs
  },

  // TODO; what happens when we execute with multiple browsers, etc?
  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)
    const { organizationId, file, immediate } = args

    try {
      const client = helpers.getClient(argv)
      const input = helpers.loadJsonFile(file)
      const [result, passing, screenshotPassing] = await client.executeTestOnDemand(
        organizationId,
        input,
        { wait: !immediate },
      )
      const { overallPassing, exitOk } = helpers.resolvePassingStatus(
        argv,
        passing,
        screenshotPassing,
      )

      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Result: ${result.name}`,
          id: result._id,
          passing: overallPassing,
        })
      }

      process.exit(exitOk ? 0 : 1)
    } catch (error) {
      throw error
    }
  },
}
