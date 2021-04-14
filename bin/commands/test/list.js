const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the tests in your account.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getTests()
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
