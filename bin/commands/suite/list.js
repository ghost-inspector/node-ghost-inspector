const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the suites in your account.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const results = await client.getSuites()
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
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
