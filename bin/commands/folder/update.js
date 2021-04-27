const helpers = require('../../helpers')

module.exports = {
  command: 'update <folderId> <folderName>',
  desc: 'Update a folder with new <folderName>.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    const result = await client.updateFolder(argv.folderId, argv.folderName)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Folder updated: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
