const helpers = require('../../helpers')

module.exports = {
  command: 'get-running <organizationId>',
  desc: 'Fetch a list of the currently-executing results for the entire organization and return the results.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getAllRunningTests(argv.organizationId)
    if (argv.json) {
      helpers.printJson(results)
    } else {
      results.forEach((item) => {
        helpers.print({
          message: item.name,
          id: item._id,
        })
      })
    }

    process.exit(0)
  },
}
