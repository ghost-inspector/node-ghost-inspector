const helpers = require('../../helpers')

module.exports = {
  command: 'execute-on-demand <organizationId> <file> [options]',
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
  handler: async function (rawArgs) {
    // pass raw args to ngrkok
    rawArgs = await helpers.ngrokSetup(rawArgs)

    // clean up yargs-related stuff
    const args = helpers.cleanArgs(rawArgs)
    const { organizationId, file, immediate } = args

    const client = helpers.getClient(rawArgs)
    const test = helpers.loadJsonFile(file)

    // process ngrokUrlVariable, since API endpoint doesn't accept variables
    if (rawArgs.ngrokTunnel) {
      if (rawArgs.ngrokUrlVariable === 'startUrl') {
        test.startUrl = rawArgs.startUrl
      } else {
        test.variables = test.variables || {}
        test.variables[rawArgs.ngrokUrlVariable] = rawArgs[rawArgs.ngrokUrlVariable]
      }
    }

    const [result, passing, screenshotPassing] = await client.executeTestOnDemand(
      organizationId,
      test,
      { wait: !immediate },
    )
    const { overallPassing, exitOk } = helpers.resolvePassingStatus(
      rawArgs,
      passing,
      screenshotPassing,
    )

    if (rawArgs.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Result: ${result.name}`,
        id: result._id,
        passing: overallPassing,
      })
    }

    await helpers.ngrokTeardown(rawArgs)

    process.exit(exitOk ? 0 : 1)
  },
}
