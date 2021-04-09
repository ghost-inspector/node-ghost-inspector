const helpers = require('../../helpers')

module.exports = {
  command: 'execute <test-id> [options]',
  desc: 'Execute a test with the provided options.',

  builder: (yargs) => {
    yargs.options({
      ...helpers.getCommonExecutionOptions(),
      // execute-test only
      'screenshot-compare-baseline-result': {
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
    try {
      const client = helpers.getClient(argv)
      const [result, passing, screenshotPassing] = await client.executeTest(testId, args)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Result: ${result.name}`,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
