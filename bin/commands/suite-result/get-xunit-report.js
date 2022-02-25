const helpers = require('../../helpers')

module.exports = {
  command: 'get-xunit-report <suiteResultId>',
  desc: 'Fetch an XML report (XUnit v2) for a suite result.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.getSuiteResultXUnit(argv.suiteResultId)
    console.log(result)

    process.exit(0)
  },
}
