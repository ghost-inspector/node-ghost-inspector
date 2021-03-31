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
    })
    return yargs
  },

  handler: async function (argv) {
    const args = helpers.cleanArgs(argv)

    const testId = args.testId
    delete args['testid']
    try {
      const client = require('../../../index')(argv.apiKey)
      const [result, passing, screenshotPassing] = await client.executeTest(testId, args)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
