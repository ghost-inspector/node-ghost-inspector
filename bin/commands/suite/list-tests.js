const helpers = require('../../helpers')

module.exports = {
  command: 'list-tests <suite-id>',
  desc: 'Fetch an array of all the tests in a suite.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getSuiteTests(argv.suiteId)
    if (argv.json) {
      helpers.printJson(results)
    } else {
      results.forEach((item) => {
        helpers.print({
          message: item.name,
          id: item._id,
          passing: item.passing,
        })
      })
    }

    process.exit(0)
  },
}
