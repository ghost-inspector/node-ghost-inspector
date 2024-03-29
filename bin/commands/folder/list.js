const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the folders in your account.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getFolders()
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
