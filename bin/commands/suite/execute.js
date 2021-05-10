const helpers = require('../../helpers')

module.exports = {
  command: 'execute <suiteId> [options]',
  desc: 'Execute a suite with the provided options.',

  builder: (yargs) => {
    yargs.options({
      ...helpers.getCommonExecutionOptions(),
    })
    return yargs
  },

  handler: async function (rawArgs) {
    // pass raw args to ngrok
    rawArgs = await helpers.ngrokSetup(rawArgs)

    const executionArgs = helpers.cleanArgs(rawArgs)

    // pull out the suiteId & apiKey so the rest can be passed in verbatim
    const suiteId = executionArgs.suiteId
    delete executionArgs.suiteId

    // execute
    const client = helpers.getClient(rawArgs)
    let [result, passing, screenshotPassing] = await client.executeSuite(suiteId, executionArgs)
    const { exitOk } = helpers.resolvePassingStatus(rawArgs, passing, screenshotPassing)

    if (rawArgs.json) {
      helpers.printJson(result)
    } else {
      // handle multiple results
      if (!Array.isArray(result)) {
        result = [result]
      }
      result.forEach((item) => {
        const { overallPassing } = helpers.resolvePassingStatus(
          rawArgs,
          item.passing,
          item.screenshotComparePassing,
        )
        helpers.print({
          message: `Suite result: ${item.name}`,
          id: item._id,
          passing: overallPassing,
        })
      })
    }

    await helpers.ngrokTeardown(rawArgs)

    process.exit(exitOk ? 0 : 1)
  },
}
