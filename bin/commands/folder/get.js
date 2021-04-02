const helpers = require('../../helpers')

module.exports = {
  command: 'get <folder-id>',
  desc: 'Fetch a single folder.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getFolder(argv.folderId)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
