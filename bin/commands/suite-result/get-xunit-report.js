const helpers = require('../../helpers')

module.exports = {
  command: 'get-xunit-report <suite-result-id>',
  desc: 'Fetch an XML report (XUnit v2) for a suite result.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getSuiteResultXUnit(argv.suiteResultId)
      console.log(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
