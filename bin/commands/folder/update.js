const helpers = require('../../helpers')

module.exports = {
  command: 'update <folder-id> <folder-name>',
  desc: 'Update a folder with new <folder-name>.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.updateFolder(argv.folderId, argv.folderName)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
