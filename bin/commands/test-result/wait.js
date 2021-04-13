const helpers = require('../../helpers')

module.exports = {
  command: 'wait <result-id>',
  desc: 'Poll a running test result until complete.',
  builder: (yargs) => {
    yargs.options({
      'error-on-fail': {
        description:
          'Exit the command with a non-0 status if the test or suite passing value is not `true`. Ignored when used with --immediate',
        default: false,
      },
      'error-on-screenshot-fail': {
        description:
          'Exit the command with a non-0 status if the test or suite screenshotComparePassing value is not `true`. Ignored when used with --immediate',
        default: false,
      },
      pollInterval: {
        description: 'Interval (in ms) to check for updated result.',
        default: 2000,
      },
    })
    return yargs
  },
  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const resultId = args.resultId
    delete args['resultId']

    try {
      const client = helpers.getClient(argv)
      const result = await client.waitForTestResult(resultId, args)

      // GhostInspector.waitForTestResult() return value is a little different than
      // the execute* methods, we'll manually implement the passing and screenshot
      // values to stay consistent with --errorOnFail, --errorOnScreenshotFail
      // functionality
      const passing = result.passing
      const screenshotPassing = result.screenshotComparePassing

      const { overallPassing, exitOk } = helpers.resolvePassingStatus(
        argv,
        passing,
        screenshotPassing,
      )

      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: result.name,
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
