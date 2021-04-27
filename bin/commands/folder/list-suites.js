const helpers = require('../../helpers')

module.exports = {
  command: 'list-suites <folderId>',
  desc: 'Fetch an array of all the suites in a folder.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const results = await client.getFolderSuites(argv.folderId)
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
