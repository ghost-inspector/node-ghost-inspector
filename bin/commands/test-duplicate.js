
const helpers = require('../helpers')

module.exports = {
  command: 'duplicate-test <testId>',
  desc: 'Duplicate a test.',
  builder: {},
  handler: async function (argv) {
    // pull out the testId & apiKey so the rest can be passed in verbatim
    const testId = args.testId
    delete args['testid']

    const apiKey = args.apiKey
    delete args['apiKey']

    // execute
    try {
      const client = require('../../index')(apiKey)
      const result = await client.duplicateTest(testId)
      // print out result, regardless
      console.log(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}