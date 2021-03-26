
const helpers = require('../../helpers')

module.exports = {
  command: 'execute <test-id> [options]',
  desc: 'Execute a test with the provided options.',

  builder: (yargs) => {
    yargs.options({
      ...helpers.getCommonExecutionOptions(),
      // execute-test only
      'screenshot-compare-baseline-result': {
        description: 'The ID of any completed test result across your organization to use as the baseline for the screenshot comparison Will be ignored if screenshot comparison or visual capture is disabled.',
      }
    })
    return yargs
  },

  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)

    // pull out the testId & apiKey so the rest can be passed in verbatim
    const testId = args.testId
    delete args['testid']

    const apiKey = args.apiKey
    delete args['apiKey']

    // execute
    try {
      const client = require('../../../index')(apiKey)
      const [result, passing, screenshotPassing] = await client.executeTest(testId, args)
      // print out result, regardless
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}