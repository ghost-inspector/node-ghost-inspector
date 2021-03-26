
const helpers = require('../../helpers')

module.exports = {
  command: 'update <folder-id> <folder-name>',
  desc: 'Update a folder with new <folder-name>.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.updateFolder(argv.folderId, argv.folderName)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }
    process.exit(0)
  }
}