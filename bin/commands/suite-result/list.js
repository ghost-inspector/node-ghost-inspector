const helpers = require('../../helpers')

module.exports = {
  command: 'list <suiteId>',
  desc: 'Fetch an array of suite results for a suite.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getSuiteResults(argv.suiteId)
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
