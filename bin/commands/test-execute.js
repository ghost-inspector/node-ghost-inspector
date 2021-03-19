
const helpers = require('../helpers')

module.exports = {
  command: 'execute-test <testId> [options]',
  desc: 'Execute a test with the provided options.',

  builder: (yargs) => {
    helpers.addExecutionArgs(yargs)
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
      const client = require('../../index')(apiKey)
      const [result, passing, screenshotPassing] = await client.executeTest(testId, args)
      // print out result, regardless
      console.log(result)
      // fail the process if not passing
      if (!args.immediate && !passing) {
        process.exit(1)
      }
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}