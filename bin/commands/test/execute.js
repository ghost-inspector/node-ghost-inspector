const helpers = require('../../helpers')

module.exports = {
  command: 'execute <testId> [options]',
  desc: 'Execute a test with the provided options.',

  builder: (yargs) => {
    yargs.options({
      ...helpers.getCommonExecutionOptions(),
      // execute-test only
      screenshotCompareBaselineResult: {
        description:
          'The ID of any completed test result across your organization to use as the baseline for the screenshot comparison Will be ignored if screenshot comparison or visual capture is disabled.',
      },
      webhook: {
        description:
          'An escaped URL (or array of URLs) added to the webhooks list for this execution only',
      },
    })
    return yargs
  },

  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const testId = args.testId
    delete args['testId']

    const client = helpers.getClient(argv)
    let [result, passing, screenshotPassing] = await client.executeTest(testId, args)

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
          message: `Result: ${item.name}`,
          id: item._id,
          passing: overallPassing,
        })
      })
    }

    process.exit(exitOk ? 0 : 1)
  },
}
