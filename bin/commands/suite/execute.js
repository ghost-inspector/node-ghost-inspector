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

  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    // pull out the suiteId & apiKey so the rest can be passed in verbatim
    const suiteId = args.suiteId
    delete args.suiteId

    // execute
    const client = helpers.getClient(argv)
    let [result, passing, screenshotPassing] = await client.executeSuite(suiteId, args)
    const { exitOk } = helpers.resolvePassingStatus(argv, passing, screenshotPassing)

    if (argv.json) {
      helpers.printJson(result)
    } else {
      // handle multiple results
      if (!Array.isArray(result)) {
        result = [result]
      }
      result.forEach((item) => {
        const { overallPassing } = helpers.resolvePassingStatus(
          argv,
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

    process.exit(exitOk ? 0 : 1)
  },
}
