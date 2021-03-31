const helpers = require('../../helpers')

module.exports = {
  command: 'list-suites <folder-id>',
  desc: 'Fetch an array of all the suites in a folder.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getFolderSuites(argv.folderId)
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
